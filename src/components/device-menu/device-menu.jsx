import { useCallback } from 'preact/hooks';
import { nanoid, classNames } from '@blockcode/utils';
import { useProjectContext, setAlert, delAlert, openPromptModal } from '@blockcode/core';
import { MPYUtils } from '@blockcode/board';

import { Spinner, Text, MenuSection, MenuItem } from '@blockcode/core';
import { BoardsSection } from './boards-section';
import styles from './device-menu.module.css';

let downloadAlertId = null;

const deviceFilters = [
  // {
  //   usbVendorId: 0x303a, // Espressif Vendor ID
  //   usbProductId: 0x8001, // Arcade Product ID
  // },
];

const removeDownloading = () => {
  delAlert(downloadAlertId);
  downloadAlertId = null;
};

const downloadingAlert = (progress) => {
  if (!downloadAlertId) {
    downloadAlertId = nanoid();
  }
  if (progress < 100) {
    setAlert({
      id: downloadAlertId,
      icon: <Spinner level="success" />,
      message: (
        <Text
          id="gui.alert.downloadingProgress"
          defaultMessage="Downloading...{progress}%"
          progress={progress}
        />
      ),
    });
  } else {
    setAlert('downloadCompleted', { id: downloadAlertId });
    setTimeout(removeDownloading, 2000);
  }
};

const errorAlert = (err) => {
  if (err === 'NotFoundError') return;
  setAlert('connectionError', 1000);
};

export function DeviceMenu({ itemClassName }) {
   const { meta, file } = useProjectContext();

  const handleDownload = useCallback(async () => {
    if (downloadAlertId) return;

    let currentDevice;
    try {
      currentDevice = await MPYUtils.connect(deviceFilters);
      
    } catch (err) {
      console.log(err);
      errorAlert(err.name);
    }
    if (!currentDevice) return;

    const checker = MPYUtils.check(currentDevice).catch(() => {
      errorAlert();
      removeDownloading();
    });
    let newFile = Object.assign({}, file.value);
    newFile.id = "main.py";
    const projectFiles = [].concat(newFile);

    downloadingAlert('0.0');

    try {
      // 开始下载
      await MPYUtils.write(currentDevice, projectFiles, downloadingAlert);
      currentDevice.hardReset();
    } catch (err) {
      errorAlert(err);
    }finally{
      removeDownloading();
    }

    
    checker.cancel();
  }, []);

  return (
    <>
      <MenuSection>
        <MenuItem
          disabled={downloadAlertId}
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

      <BoardsSection itemClassName={itemClassName} />
    </>
  );
}
