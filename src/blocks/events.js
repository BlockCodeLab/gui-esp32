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

  const timerIds = ['1', '2', '3', '4'];

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
        text: translate('esp32.blocks.whentimer', 'when timer # %1 per %2 milliseconds'),
        hat: true,
        inputs: {
          ID: {
            menu: timerIds,
          },
          PERIOD: {
            type: 'integer',
            defaultValue: 500,
          },
        },
        mpy(block) {
          const period = this.valueToCode(block, 'PERIOD', this.ORDER_NONE) || 500;
          let id = parseInt(block.getFieldValue('ID') || '1', 10) - 1;
          if (id < 0) {
            id = 0;
          }
          const timerName = `timer_${id}`;
          const periodName = `period_${id}`;
          const eventName = `period_${id}_event`;
          this.definitions_['timer'] = 'from machine import Timer';
          this.definitions_[timerName] = `${timerName} = Timer(${id})`;
          this.definitions_[periodName] = `${periodName} = ${period}`;
          this.definitions_[eventName] = `${eventName} = asyncio.Event()`;

          // 定义定时器回调函数
          let branchCode = this.statementToCode(block) || this.PASS;
          let code = '';
          code += 'while True:\n';
          code += `${this.INDENT}await ${eventName}.wait()\n`;
          code += `${this.INDENT}${eventName}.clear()\n`;
          code += branchCode;

          branchCode = this.prefixLines(code, this.INDENT);
          branchCode = this.addEventTrap(branchCode, block.id);
          code = '@_tasks__.append\n';
          code += branchCode;
          return code;
        },
      },
      {
        // 开启定时器
        id: 'timeron',
        text: translate('esp32.blocks.timeron', 'start timer # %1'),
        inputs: {
          ID: {
            menu: timerIds,
          },
        },
        mpy(block) {
          let id = parseInt(block.getFieldValue('ID') || '1', 10) - 1;
          if (id < 0) {
            id = 0;
          }
          this.definitions_['timer'] = 'from machine import Timer';

          let code = '';
          code += `timer_${id}.init(`;
          code += `mode=Timer.PERIODIC, period=period_${id}, callback=lambda _: period_${id}_event.set()`;
          code += ')\n';
          return code;
        },
      },
      {
        // 关闭定时器
        id: 'timeroff',
        text: translate('esp32.blocks.timeroff', 'stop timer # %1'),
        inputs: {
          ID: {
            menu: timerIds,
          },
        },
        mpy(block) {
          let id = parseInt(block.getFieldValue('ID') || '1', 10) - 1;
          if (id < 0) {
            id = 0;
          }
          let code = '';
          code += `timer_${id}.deinit()\n`;
          code += 'return\n';
          return code;
        },
      },
    ],
  };
};
