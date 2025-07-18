import { translate, themeColors } from '@blockcode/core';
import { ESP32Boards } from '../lib/boards';

export default (boardType) => {
  let boardName = translate('esp32.menubar.device.esp32', 'ESP32');
  switch (boardType) {
    case ESP32Boards.ESP32S3:
      boardName = translate('esp32.menubar.device.esp32s3', 'ESP32-S3');
      break;
    case ESP32Boards.ESP32C3:
      boardName = translate('esp32.menubar.device.esp32c3', 'ESP32-C3');
      break;
    case ESP32Boards.ESP32_IOT_BOARD:
      boardName = translate('esp32.menubar.device.esp32IotBoard', 'ESP32 IOT Board');
      break;
  }

  return {
    id: 'event',
    name: '%{BKY_CATEGORY_EVENTS}',
    themeColor: themeColors.blocks.events.primary,
    inputColor: themeColors.blocks.events.secondary,
    otherColor: themeColors.blocks.events.tertiary,
    blocks: [
      {
        // 开始
        id: 'whenstart',
        text: translate('esp32.blocks.whenstart', 'when {name} start', { name: boardName }),
        hat: true,
        mpy(block) {
          let branchCode = this.statementToCode(block) || this.PASS;
          branchCode = this.addEventTrap(branchCode, block.id);
          let code = '';
          code += '@_tasks__.append\n';
          code += branchCode;
          return code;
        },
      },
      '---',
      {
        // 定时器
        id: 'whentimer',
        text: translate('esp32.blocks.whentimer', 'when timer per %1 milliseconds'),
        hat: true,
        inputs: {
          TIME: {
            type: 'integer',
            defaultValue: 500,
          },
        },
        mpy(block) {},
      },
      {
        // 开启定时器
        id: 'timeron',
        text: translate('esp32.blocks.timeron', 'start timer'),
        mpy(block) {},
      },
      {
        // 关闭定时器
        id: 'timeroff',
        text: translate('esp32.blocks.timeroff', 'stop timer'),
        mpy(block) {},
      },
    ],
  };
};
