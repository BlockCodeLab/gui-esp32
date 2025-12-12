import { useEffect, useMemo, useCallback } from 'preact/hooks';
import { useSignal } from '@preact/signals';
import { nanoid, classNames, sleep, Base64Utils, getBinaryCache, setBinaryCache } from '@blockcode/utils';
import { useAppContext, useProjectContext, setAlert, delAlert, setAppState } from '@blockcode/core';
import { ESPTool } from '@blockcode/board';
import { ESP32Boards } from '../../lib/boards';
import { firmwares } from '../../../package.json';
import deviceFilters from './device-filters.yaml';

import { Text, Spinner, MenuSection, MenuItem } from '@blockcode/core';
import styles from './device-menu.module.css';

let alertId = null;

const uploadingAlert = (progress) => {
  if (!alertId) {
    alertId = nanoid();
  }
  if (progress < 100) {
    setAlert({
      id: alertId,
      icon: <Spinner level="success" />,
      message: (
        <Text
          id="esp32.menubar.device.restoring"
          defaultMessage="Firmware restoring...{progress}%"
          progress={progress}
        />
      ),
    });
  } else {
    setAlert({
      id: alertId,
      icon: <Spinner level="success" />,
      message: (
        <Text
          id="esp32.menubar.device.recovering"
          defaultMessage="Recovering..."
        />
      ),
    });
  }
};

const closeAlert = () => {
  delAlert(alertId);
  alertId = null;
};

const errorAlert = (err) => {
  if (err === 'NotFoundError') return;
  setAlert('connectionError', 1000);
};

// 下载固件
const getFirmware = async (downloadUrl) => {
  try {
    return await fetch(downloadUrl, {
      method: 'GET',
    });
  } catch (err) {
    await sleep(1);
    return getFirmware(downloadUrl);
  }
};

// 查询是否有缓存固件
const getFirmwareCache = async (firmwareName, downloadUrl, firmwareHash, firmwareVersion, readyForUpdate) => {
  if (readyForUpdate.value) return;

  const cacheName = `${firmwareName}Firmware`;

  const data = await getBinaryCache(cacheName);

  // 比对缓存固件版本
  if (data?.hash === firmwareHash && data?.binaryString) {
    readyForUpdate.value = true;
    delete getFirmwareCache.downloading;
    return;
  }

  // 缓存固件不存在或版本不匹配，下载固件
  // 防止重复下载
  if (getFirmwareCache.downloading) return;

  // 下载中
  getFirmwareCache.downloading = true;

  const res = await getFirmware(downloadUrl);
  const buffer = await res.arrayBuffer();

  delete getFirmwareCache.downloading;

  // 检查hash值
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hash = Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  if (hash !== firmwareHash) {
    getFirmwareCache(firmwareName, downloadUrl, firmwareHash, firmwareVersion, readyForUpdate);
    return;
  }

  // 进行缓存
  await setBinaryCache(cacheName, {
    version: firmwareVersion,
    hash: firmwareHash,
    binaryString: Base64Utils.arrayBufferToBinaryString(buffer),
  });
  readyForUpdate.value = true;
};

const uploadData = async (esploader, data) => {
  if (!alertId) {
    alertId = nanoid();
  }
  setAlert({
    id: alertId,
    icon: <Spinner level="success" />,
    message: (
      <Text
        id="esp32.menubar.device.erasing"
        defaultMessage="Erasing..."
      />
    ),
  });

  try {
    await esploader.main();
    await ESPTool.writeFlash(esploader, data, true, (val) => uploadingAlert(val));
    setAlert({
      id: alertId,
      icon: null,
      message: (
        <Text
          id="esp32.menubar.device.restoreDone"
          defaultMessage="Firmware resotre completed! Now press RESET key"
        />
      ),
      onClose: closeAlert,
    });
  } catch (err) {
    errorAlert(err.name);
    closeAlert();
  }
  await ESPTool.disconnect(esploader);
};

const uploadFirmware = async (firmwareName) => {
  if (alertId) return;

  let esploader;
  try {
    esploader = await ESPTool.connect(deviceFilters, 460800);
  } catch (err) {
    errorAlert(err.name);
  }
  if (!esploader) return;

  // 从缓存中升级到最新固件
  if (firmwareName) {
    const data = await getBinaryCache(`${firmwareName}Firmware`);
    if (data) {
      uploadData(esploader, [
        {
          data: data.binaryString,
          address: 0,
        },
      ]);
    }
    return;
  }

  // 用户自选固件
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = '.bin';
  fileInput.multiple = false;
  fileInput.click();
  fileInput.addEventListener('cancel', () => ESPTool.disconnect(esploader));
  fileInput.addEventListener('change', async (e) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(e.target.files[0]);
    reader.addEventListener('load', (e) =>
      uploadData(esploader, [
        {
          data: Base64Utils.arrayBufferToBinaryString(e.target.result),
          address: 0,
        },
      ]),
    );
  });
};

export function FirmwareSection({ disabled, itemClassName }) {
  const { appState } = useAppContext();

  const { meta } = useProjectContext();

  const readyForUpdate = useSignal(false);

  const firmwareJson = useSignal(null);

  const firmwareName = useMemo(() => {
    if (meta.value.boardType === ESP32Boards.ESP32_IOT_BOARD) {
      firmwareJson.value = null;
      return 'iotboard';
    }
    if (meta.value.boardType === ESP32Boards.ESP32S3_CAM) {
      firmwareJson.value = null;
      return 'esp32s3cam';
    }
  }, [meta.value.boardType]);

  const firmwareLabel = useMemo(() => {
    if ([ESP32Boards.ESP32_IOT_BOARD, ESP32Boards.ESP32S3_CAM].includes(meta.value.boardType)) {
      return (
        <Text
          id="esp32.menubar.device.firmware"
          defaultMessage="Restore v{version} firmware..."
          version={firmwareJson.value?.version}
        />
      );
    }
  }, [meta.value.boardType, firmwareJson.value?.version]);

  useEffect(() => (alertId = null), []);

  useEffect(async () => {
    if (!firmwareName || !firmwares[firmwareName]) return;
    readyForUpdate.value = false;
    const baseUrl = firmwares[firmwareName].download;
    if (!firmwareJson.value) {
      firmwareJson.value = await fetch(`${baseUrl}/version.json`).then((res) => res.json());
    }
    const downloadUrl = `${baseUrl}/${firmwareJson.value.download}`.replaceAll('{version}', firmwareJson.value.version);
    const firmwareHash = firmwareJson.value.hash;
    getFirmwareCache(firmwareName, downloadUrl, firmwareHash, firmwareJson.value.version, readyForUpdate);
  }, [firmwareName]);

  const handleUploadFirmware = useCallback(async () => {
    setAppState('currentDevice', null);
    await appState.value?.currentDevice?.disconnect();
    uploadFirmware(firmwareName);
  }, [firmwareName]);

  return (
    <MenuSection>
      <MenuItem
        disabled={disabled || alertId || (firmwareLabel && !readyForUpdate.value)}
        className={classNames(itemClassName, styles.blankCheckItem)}
        onClick={handleUploadFirmware}
      >
        {firmwareLabel ? (
          readyForUpdate.value ? (
            firmwareLabel
          ) : (
            <Text
              id="esp32.menubar.device.caching"
              defaultMessage="Caching latest firmware..."
            />
          )
        ) : (
          <Text
            id="esp32.menubar.device.micropythonFirmware"
            defaultMessage="Restore MicroPython firmware"
          />
        )}
      </MenuItem>
    </MenuSection>
  );
}
