import { useAppContext, Text } from '@blockcode/core';
import { ESP32Boards } from '../../lib/boards';

import deviceIcon from './icon-device.png';

export function DeviceLabel() {
  const { appState } = useAppContext();

  if (appState.value?.boardType === ESP32Boards.ESP32S3) {
    return (
      <Text
        id="esp32.menubar.device.esp32s3"
        defaultMessage="ESP32-S3"
      />
    );
  }

  if (appState.value?.boardType === ESP32Boards.ESP32C3) {
    return (
      <Text
        id="esp32.menubar.device.esp32c3"
        defaultMessage="ESP32-C3"
      />
    );
  }

  if (appState.value?.boardType === ESP32Boards.ESP32C6) {
    return (
      <Text
        id="esp32.menubar.device.esp32c6"
        defaultMessage="ESP32-C6"
      />
    );
  }

  return (
    <Text
      id="esp32.menubar.device.esp32"
      defaultMessage="ESP32"
    />
  );
}
