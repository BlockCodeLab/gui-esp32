import { useEffect, useMemo } from 'preact/hooks';
import { useSignal } from '@preact/signals';
import { nanoid, classNames, sleep, arrayBufferToBinaryString, getBinaryCache, setBinaryCache } from '@blockcode/utils';
import { useProjectContext, setAlert, delAlert, openPromptModal } from '@blockcode/core';
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
const getFirmwareCache = async (cacheName, downloadUrl, firmwareHash, firmwareVersion, readyForUpdate) => {
  if (readyForUpdate.value) return;

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
    getFirmwareCache(cacheName, downloadUrl, firmwareHash, firmwareVersion, readyForUpdate);
    return;
  }

  // 进行缓存
  await setBinaryCache(cacheName, {
    version: firmwareVersion,
    hash: firmwareHash,
    binaryString: arrayBufferToBinaryString(buffer),
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

  const checker = ESPTool.check(esploader).catch(() => {
    errorAlert();
    closeAlert();
    ESPTool.disconnect(esploader);
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
          defaultMessage="Firmware resotre completed!"
        />
      ),
      onClose: closeAlert,
    });
  } catch (err) {
    errorAlert(err.name);
    closeAlert();
  } finally {
    checker.cancel();
  }
  await ESPTool.disconnect(esploader);
};

const uploadFirmware = async (firmwareCache) => {
  if (alertId) return;

  let esploader;
  try {
    esploader = await ESPTool.connect(deviceFilters, 460800);
  } catch (err) {
    errorAlert(err.name);
  }
  if (!esploader) return;

  // 从缓存中升级到最新固件
  if (firmwareCache) {
    const data = await getBinaryCache(firmwareCache);
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
          data: arrayBufferToBinaryString(e.target.result),
          address: 0,
        },
      ]),
    );
  });
};

export function FirmwareSection({ itemClassName }) {
  const { meta } = useProjectContext();

  const readyForUpdate = useSignal(false);

  const firmwareJson = useSignal(null);

  const cacheName = useMemo(() => {
    if (meta.value.boardType === ESP32Boards.ESP32_IOT_BOARD) {
      return 'iotboardFirmware';
    }
  }, [meta.value.boardType]);

  const firmwareLabel = useMemo(() => {
    if (meta.value.boardType === ESP32Boards.ESP32_IOT_BOARD) {
      return (
        <Text
          id="esp32.menubar.device.iotboardFirmware"
          defaultMessage="Restore IOT Board firmware"
        />
      );
    }
  }, [meta.value.boardType]);

  useEffect(() => (alertId = null), []);

  useEffect(async () => {
    if (!cacheName) return;
    readyForUpdate.value = false;
    const baseUrl = firmwares.iotboard.download;
    if (!firmwareJson.value) {
      firmwareJson.value = await fetch(`${baseUrl}/version.json`).then((res) => res.json());
    }
    const downloadUrl = `${baseUrl}/${firmwareJson.value.download}`.replaceAll('{version}', firmwareJson.value.version);
    const firmwareHash = firmwareJson.value.hash;
    getFirmwareCache(cacheName, downloadUrl, firmwareHash, firmwareJson.value.version, readyForUpdate);
  }, [cacheName]);

  return (
    <MenuSection>
      <MenuItem
        disabled={alertId || (firmwareLabel && !readyForUpdate.value)}
        className={classNames(itemClassName, styles.blankCheckItem)}
        onClick={() => uploadFirmware(cacheName)}
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
            id="esp32.menubar.device.firmware"
            defaultMessage="Restore firmware"
          />
        )}
      </MenuItem>
    </MenuSection>
  );
}
