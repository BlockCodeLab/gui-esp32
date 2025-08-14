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
        // 设置定时器
        id: 'timerset',
        text: translate('esp32.blocks.timerset', 'set timer # %1 per %2 milliseconds'),
        substack: true,
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
          const flagName = `period_${id}_flag`;
          this.definitions_['import_timer'] = 'from machine import Timer';
          this.definitions_[timerName] = `${timerName} = Timer(${id})`;
          this.definitions_[flagName] = `${flagName} = asyncio.ThreadSafeFlag()`;

          // 定义定时器回调函数
          let branchCode = this.statementToCode(block, 'SUBSTACK') || this.PASS;
          let code = '';
          code += 'while True:\n';
          code += `${this.INDENT}await ${flagName}.wait()\n`;
          code += branchCode;

          branchCode = this.prefixLines(code, this.INDENT);
          branchCode = this.addEventTrap(branchCode, block.id);
          code = '@_tasks__.append\n';
          code += branchCode;
          this.definitions_[`period_${id}`] = code;

          return `${timerName}.init(mode=Timer.PERIODIC, period=${period}, callback=lambda _: ${flagName}.set())\n`;
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
