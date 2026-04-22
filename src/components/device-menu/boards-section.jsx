import { useEffect, useCallback } from 'preact/hooks';
import { batch } from '@preact/signals';
import { classNames } from '@blockcode/utils';
import {
  useAppContext,
  useProjectContext,
  setAppState,
  setMeta,
  Text,
  MenuSection,
  MenuItem,
  translate,
  logger,
} from '@blockcode/core';
import { ESP32Boards } from '../../lib/boards';
import styles from './device-menu.module.css';

import checkIcon from './icon-check.svg';

export function BoardsSection({ disabled, itemClassName }) {
  const { appState } = useAppContext();
  const { meta } = useProjectContext();

  useEffect(() => {
    if (!meta.value.boardType) {
      setMeta('boardType', ESP32Boards.ESP32S3);
    }
  }, []);

  const chooseBoardHandler = useCallback(
    (boardType) => () =>
      batch(() => {
        batch(() => {
          if (appState.value?.device) {
            appState.value?.device.disconnect();
            logger.warn(translate('gui.logs.disconnected', 'Device disconnected'));
          }

          setAppState('device', null);
          setMeta({ boardType });

          let device = '';
          switch (boardType) {
            case ESP32Boards.ESP32:
              device = translate('esp32.menubar.device.esp32', 'ESP32');
              break;
            case ESP32Boards.ESP32S3:
              device = translate('esp32.menubar.device.esp32s3', 'ESP32-S3');
              break;
            case ESP32Boards.ESP32_IOT_BOARD:
              device = translate('esp32.menubar.device.esp32IotBoard', 'ESP32 IOT Board');
              break;
            case ESP32Boards.ESP32S3_CAM:
              device = translate('esp32.menubar.device.esp32s3Cam', 'ESP32S3 Cam');
              break;
          }
          logger.info(translate('gui.logs.changeDevice', 'Device changed to {device}', { device }));
        });
      }),
    [],
  );

  return (
    <>
      <MenuSection disabled={disabled}>
        <MenuItem
          className={itemClassName}
          onClick={chooseBoardHandler(ESP32Boards.ESP32)}
        >
          <img
            className={classNames(styles.checkIcon, {
              [styles.checked]: meta.value.boardType === ESP32Boards.ESP32,
            })}
            src={checkIcon}
          />
          <Text
            id="esp32.menubar.device.esp32"
            defaultMessage="ESP32"
          />
        </MenuItem>
        <MenuItem
          className={itemClassName}
          onClick={chooseBoardHandler(ESP32Boards.ESP32S3)}
        >
          <img
            className={classNames(styles.checkIcon, {
              [styles.checked]: meta.value.boardType === ESP32Boards.ESP32S3,
            })}
            src={checkIcon}
          />
          <Text
            id="esp32.menubar.device.esp32s3"
            defaultMessage="ESP32-S3"
          />
        </MenuItem>
      </MenuSection>

      <MenuSection
        disabled={disabled}
        titleClassName={styles.blankCheckItem}
        title={
          <Text
            id="esp32.menubar.device.nulllab"
            defaultMessage="NULLLAB"
          />
        }
      >
        <MenuItem
          className={itemClassName}
          onClick={chooseBoardHandler(ESP32Boards.ESP32_IOT_BOARD)}
        >
          <img
            className={classNames(styles.checkIcon, {
              [styles.checked]: meta.value.boardType === ESP32Boards.ESP32_IOT_BOARD,
            })}
            src={checkIcon}
          />
          <Text
            id="esp32.menubar.device.esp32IotBoard"
            defaultMessage="ESP32 IOT Board"
          />
        </MenuItem>
        <MenuItem
          className={itemClassName}
          onClick={chooseBoardHandler(ESP32Boards.ESP32S3_CAM)}
        >
          <img
            className={classNames(styles.checkIcon, {
              [styles.checked]: meta.value.boardType === ESP32Boards.ESP32S3_CAM,
            })}
            src={checkIcon}
          />
          <Text
            id="esp32.menubar.device.esp32s3Cam"
            defaultMessage="ESP32S3 CAM"
          />
        </MenuItem>
      </MenuSection>

      {/* <MenuSection
        disabled={disabled}
        titleClassName={styles.blankCheckItem}
        title={
          <Text
            id="esp32.menubar.device.m5stack"
            defaultMessage="M5Stack"
          />
        }
      >
        <MenuItem
          className={itemClassName}
          onClick={chooseBoardHandler(ESP32Boards.ATOMS3R_CAM)}
        >
          <img
            className={classNames(styles.checkIcon, {
              [styles.checked]: meta.value.boardType === ESP32Boards.ATOMS3R_CAM,
            })}
            src={checkIcon}
          />
          <Text
            id="esp32.menubar.device.atomS3rCam"
            defaultMessage="AtomS3R CAM"
          />
        </MenuItem>
      </MenuSection>*/}
    </>
  );
}
