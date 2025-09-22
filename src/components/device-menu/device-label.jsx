import { useProjectContext, Text } from '@blockcode/core';
import { ESP32Boards } from '../../lib/boards';

export function DeviceLabel() {
  const { meta } = useProjectContext();

  switch (meta.value.boardType) {
    case ESP32Boards.ESP32S3:
      return (
        <Text
          id="esp32.menubar.device.esp32s3"
          defaultMessage="ESP32-S3"
        />
      );

    case ESP32Boards.ESP32C3:
      return (
        <Text
          id="esp32.menubar.device.esp32c3"
          defaultMessage="ESP32-C3"
        />
      );

    case ESP32Boards.ESP32_IOT_BOARD:
      return (
        <Text
          id="esp32.menubar.device.esp32IotBoard"
          defaultMessage="ESP32 IOT Board"
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
