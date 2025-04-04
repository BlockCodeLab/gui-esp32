import { useAppContext } from '@blockcode/core';
import styles from './device-menu.module.css';

import deviceIcon from './icon-device.png';

export function DeviceIcon() {
  const { appState } = useAppContext();
  return (
    <img
      className={styles.deviceIcon}
      src={deviceIcon}
    />
  );
}
