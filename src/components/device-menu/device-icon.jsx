import { useAppContext } from '@blockcode/core';

import deviceIcon from './icon-device.svg';
import deviceConnectedIcon from './icon-device-connected.svg';

export function DeviceIcon() {
  const { appState } = useAppContext();
  return appState.value?.device ? <img src={deviceConnectedIcon} /> : <img src={deviceIcon} />;
}
