import { useCallback } from 'preact/hooks';
import { nanoid, classNames, sleepMs } from '@blockcode/utils';
import { useAppContext, useProjectContext, setAlert, delAlert, setAppState } from '@blockcode/core';
import { MPYUtils } from '@blockcode/board';
import { ESP32Boards } from '../../lib/boards';
import deviceFilters from './device-filters.yaml';

import { Spinner, Text, MenuSection, MenuItem } from '@blockcode/core';
import { BoardsSection } from './boards-section';
import { FirmwareSection } from './firmware-section';
import styles from './device-menu.module.css';

let downloadAlertId = null;

const removeDownloading = () => {
  delAlert(downloadAlertId);
  downloadAlertId = null;
};

const downloadingAlert = (progress) => {
  if (!downloadAlertId) {
    downloadAlertId = nanoid();
  }
  setAlert('downloading', {
    id: downloadAlertId,
    progress,
  });
};

const errorAlert = (err) => {
  if (err === 'NotFoundError') return;
  setAlert('connectionError', 1000);
};

const downloadProgram = async (device, mainFile, assetFiles) => {
  downloadingAlert(0);
  try {
    const projectFiles = [].concat(mainFile, assetFiles).map((file) => ({
      ...file,
      filename: file.id,
    }));

    // 开始下载
    await MPYUtils.write(device, projectFiles, downloadingAlert);
    device.reset();
    setAlert('downloadCompleted', { id: downloadAlertId });
    setTimeout(removeDownloading, 2000);
  } catch (err) {
    errorAlert(err.name);
    removeDownloading();
  }
};

export function DeviceMenu({ itemClassName }) {
  const { appState } = useAppContext();
  const { meta, file, assets } = useProjectContext();

  const connectDevice = useCallback(async (device) => {
    await appState.value?.device?.disconnect();
    await sleepMs(500);
    const handleConnect = () => connectDevice(device);
    const handleDisconnect = (err) => {
      if (err) errorAlert();
      setAppState('device', null);
      device.off('connect', handleConnect);
      device.off('disconnect', handleDisconnect);
    };
    device.on('connect', handleConnect);
    device.on('disconnect', handleDisconnect);
    setAlert('connected', 1000);
    setAppState('device', device);
  }, []);

  const handleConnectUSB = useCallback(async () => {
    if (downloadAlertId) return;
    try {
      const device = await MPYUtils.connect(deviceFilters, {
        baudRate: 115200,
      });
      connectDevice(device);
    } catch (err) {
      errorAlert(err.name);
    }
  }, []);

  const handleConnectBLE = useCallback(async () => {
    if (downloadAlertId) return;
    try {
      const device = await MPYUtils.connectBLE();
      connectDevice(device);
    } catch (err) {
      errorAlert(err.name);
    }
  }, []);

  const handleDownload = useCallback(() => {
    if (downloadAlertId) return;
    if (!appState.value?.device) return;
    downloadProgram(appState.value.device, file.value, assets.value);
  }, []);

  const handleReset = useCallback(() => {
    if (downloadAlertId) return;
    setAlert('reseting', 1000);
    appState.value?.device?.reset();
  }, []);

  const handleDisconnect = useCallback(() => {
    if (downloadAlertId) return;
    appState.value?.device?.disconnect();
  });

  return (
    <>
      <MenuSection disabled={downloadAlertId || !appState.value?.device}>
        <MenuItem
          className={classNames(itemClassName, styles.blankCheckItem)}
          label={
            <Text
              id="gui.menubar.device.download"
              defaultMessage="Download program"
            />
          }
          onClick={handleDownload}
        />
      </MenuSection>

      <MenuSection disabled={downloadAlertId}>
        {appState.value?.device ? (
          <>
            <MenuItem
              className={classNames(itemClassName, styles.blankCheckItem)}
              label={
                <Text
                  id="gui.menubar.device.disconnect"
                  defaultMessage="Disconnect device"
                />
              }
              onClick={handleDisconnect}
            />
            <MenuItem
              className={classNames(itemClassName, styles.blankCheckItem)}
              label={
                <Text
                  id="gui.menubar.device.reset"
                  defaultMessage="Reset device"
                />
              }
              onClick={handleReset}
            />
          </>
        ) : (
          <>
            <MenuItem
              className={classNames(itemClassName, styles.blankCheckItem)}
              label={
                <Text
                  id="gui.menubar.device.connectUsb"
                  defaultMessage="Connect device with USB..."
                />
              }
              onClick={handleConnectUSB}
            />
            {meta.value.boardType === ESP32Boards.ESP32_IOT_BOARD && (
              <MenuItem
                className={classNames(itemClassName, styles.blankCheckItem)}
                label={
                  <Text
                    id="gui.menubar.device.connectBle"
                    defaultMessage="Connect device with Bluetooth (BLE)..."
                  />
                }
                onClick={handleConnectBLE}
              />
            )}
          </>
        )}
      </MenuSection>

      <BoardsSection
        disabled={downloadAlertId}
        itemClassName={itemClassName}
      />

      <FirmwareSection
        disabled={downloadAlertId}
        itemClassName={itemClassName}
      />
    </>
  );
}
