import { useEffect, useCallback } from 'preact/hooks';
import { classNames } from '@blockcode/utils';
import { useAppContext, setAppState, Text, MenuSection, MenuItem } from '@blockcode/core';
import { ESP32Boards } from '../../lib/boards';
import styles from './device-menu.module.css';

import checkIcon from './icon-check.svg';

export function BoardsSection({ itemClassName }) {
  const { appState } = useAppContext();

  useEffect(() => {
    if (!appState.value?.boardType) {
      setAppState('boardType', ESP32Boards.ESP32);
    }
  }, []);

  const chooseBoardHandler = useCallback(
    (boardType) => () => {
      setAppState({ boardType });
    },
    [],
  );

  return (
    <MenuSection>
      <MenuItem
        className={itemClassName}
        onClick={chooseBoardHandler(ESP32Boards.ESP32)}
      >
        <img
          className={classNames(styles.checkIcon, {
            [styles.checked]: appState.value?.boardType === ESP32Boards.ESP32,
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
        onClick={chooseBoardHandler(ESP32Boards.ESP32S2)}
      >
        <img
          className={classNames(styles.checkIcon, {
            [styles.checked]: appState.value?.boardType === ESP32Boards.ESP32S2,
          })}
          src={checkIcon}
        />
        <Text
          id="esp32.menubar.device.esp32s2"
          defaultMessage="ESP32-S2"
        />
      </MenuItem>
      <MenuItem
        className={itemClassName}
        onClick={chooseBoardHandler(ESP32Boards.ESP32S3)}
      >
        <img
          className={classNames(styles.checkIcon, {
            [styles.checked]: appState.value?.boardType === ESP32Boards.ESP32S3,
          })}
          src={checkIcon}
        />
        <Text
          id="esp32.menubar.device.esp32s3"
          defaultMessage="ESP32-S3"
        />
      </MenuItem>
      <MenuItem
        className={itemClassName}
        onClick={chooseBoardHandler(ESP32Boards.ESP32C3)}
      >
        <img
          className={classNames(styles.checkIcon, {
            [styles.checked]: appState.value?.boardType === ESP32Boards.ESP32C3,
          })}
          src={checkIcon}
        />
        <Text
          id="esp32.menubar.device.esp32c3"
          defaultMessage="ESP32-C3"
        />
      </MenuItem>
      <MenuItem
        className={itemClassName}
        onClick={chooseBoardHandler(ESP32Boards.ESP32C6)}
      >
        <img
          className={classNames(styles.checkIcon, {
            [styles.checked]: appState.value?.boardType === ESP32Boards.ESP32C6,
          })}
          src={checkIcon}
        />
        <Text
          id="esp32.menubar.device.esp32c6"
          defaultMessage="ESP32-C6"
        />
      </MenuItem>
    </MenuSection>
  );
}
