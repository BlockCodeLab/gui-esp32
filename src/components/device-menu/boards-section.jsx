import { useEffect, useCallback } from 'preact/hooks';
import { classNames } from '@blockcode/utils';
import { useProjectContext, setMeta, Text, MenuSection, MenuItem } from '@blockcode/core';
import { ESP32Boards } from '../../lib/boards';
import styles from './device-menu.module.css';

import checkIcon from './icon-check.svg';

export function BoardsSection({ itemClassName }) {
  const { meta } = useProjectContext();

  useEffect(() => {
    if (!meta.value.boardType) {
      setMeta('boardType', ESP32Boards.ESP32S3);
    }
  }, []);

  const chooseBoardHandler = useCallback(
    (boardType) => () => {
      setMeta({ boardType });
    },
    [],
  );

  return (
    <>
      <MenuSection>
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

      <MenuSection>
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
      </MenuSection>
    </>
  );
}
