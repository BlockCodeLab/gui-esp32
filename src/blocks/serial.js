import { translate, themeColors } from '@blockcode/core';
import { ScratchBlocks } from '@blockcode/blocks';

export default () => ({
  id: 'serial',
  name: translate('esp32.blocks.serial', 'Serial'),
  themeColor: themeColors.blocks.sounds.primary,
  inputColor: themeColors.blocks.sounds.secondary,
  otherColor: themeColors.blocks.sounds.tertiary,
  order: 2,
  blocks: [
    {
      // 波特率
      id: 'baudrate',
      text: translate('esp32.blocks.serialBaudrate', 'set baudrate to %1'),
      inputs: {
        BAUDRATE: {
          menu: {
            inputMode: true,
            type: 'integer',
            defaultValue: '115200',
            items: ['4800', '9600', '38400', '57600', '115200'],
          },
        },
      },
      mpy(block) {
        const baud = this.valueToCode(block, 'BAUDRATE', this.ORDER_NONE);
        this.definitions_['import_uart'] = 'from machine import UART';
        this.definitions_['uart'] = 'uart = UART(0)';
        return `uart.init(${baud})\n`;
      },
    },
    {
      // 超时
      id: 'timeout',
      text: translate('esp32.blocks.serialTimeout', 'set timeout to %1 milliseconds'),
      inputs: {
        TIMEOUT: {
          type: 'integer',
          defaultValue: 1000,
        },
      },
      mpy(block) {
        const timeout = this.valueToCode(block, 'TIMEOUT', this.ORDER_NONE);
        this.definitions_['import_uart'] = 'from machine import UART';
        this.definitions_['uart'] = 'uart = UART(0)';
        return `uart.timeout = ${timeout} / 1000\n`;
      },
    },
    '---',
    {
      // 打印
      id: 'print',
      text: translate('esp32.blocks.serialPrint', 'print %1 with %2'),
      inputs: {
        STRING: {
          type: 'string',
          defaultValue: 'hello',
        },
        MODE: {
          menu: [
            [translate('esp32.blocks.serialPrintWarp', 'warp'), 'WARP'],
            [translate('esp32.blocks.serialPrintNoWarp', 'no-warp'), 'NOWARP'],
            [translate('esp32.blocks.serialPrintHEX', 'hex'), 'HEX'],
          ],
        },
      },
      mpy(block) {
        const str = this.valueToCode(block, 'STRING', this.ORDER_NONE);
        const mode = block.getFieldValue('MODE') || 'WARP';
        this.definitions_['import_uart'] = 'from machine import UART';
        this.definitions_['uart'] = 'uart = UART(0)';

        if (mode === 'WARP') {
          return `uart.write(${str} + '\\n')\n`;
        } else if (mode === 'NOWARP') {
          return `uart.write(${str})\n`;
        } else if (mode === 'HEX') {
          return `uart.write(hex(${str}))\n`;
        }
      },
    },
    {
      // 打印数字
      id: 'print_number',
      text: translate('esp32.blocks.serialPrintNumber', 'print %1'),
      inputs: {
        NUM: {
          type: 'number',
          defaultValue: 0,
        },
      },
      mpy(block) {
        const num = this.valueToCode(block, 'NUM', this.ORDER_NONE);
        this.definitions_['import_uart'] = 'from machine import UART';
        this.definitions_['uart'] = 'uart = UART(0)';
        return `uart.write(str(${num}) + '\n')\n`;
      },
    },
    '---',
    {
      // 接收到？
      id: 'available',
      text: translate('esp32.blocks.serialAvailable', 'available data?'),
      output: 'boolean',
      mpy(block) {
        this.definitions_['import_uart'] = 'from machine import UART';
        this.definitions_['uart'] = 'uart = UART(0)';
        return [`uart.any() > 0`, this.ORDER_RELATIONAL];
      },
    },
    {
      // 接收到？
      id: 'available_length',
      text: translate('esp32.blocks.serialAvailableLength', 'available data length'),
      output: 'number',
      mpy(block) {
        this.definitions_['import_uart'] = 'from machine import UART';
        this.definitions_['uart'] = 'uart = UART(0)';
        return [`uart.any()`, this.ORDER_FUNCTION_CALL];
      },
    },
    '---',
    {
      // 读取文本
      id: 'read_string',
      text: translate('esp32.blocks.serialReadString', 'read a string'),
      output: 'string',
      mpy(block) {
        this.definitions_['import_uart'] = 'from machine import UART';
        this.definitions_['uart'] = 'uart = UART(0)';
        return [`uart.read().decode('utf-8')`, this.ORDER_FUNCTION_CALL];
      },
    },
    {
      // 读取文本直到
      id: 'read_string_until',
      text: translate('esp32.blocks.serialReadStringUntil', 'read a string until %1'),
      output: 'string',
      inputs: {
        CHAR: {
          type: 'string',
          defaultValue: 'a',
        },
      },
      mpy(block) {
        const char = this.valueToCode(block, 'CHAR', this.ORDER_NONE);
        this.definitions_['import_uart'] = 'from machine import UART';
        this.definitions_['uart'] = 'uart = UART(0)';
        return [`uart.readuntil(${char}).decode('utf-8')`, this.ORDER_FUNCTION_CALL];
      },
    },
    '---',
    {
      // 读取数字
      id: 'read_parse',
      text: translate('esp32.blocks.serialReadParse', 'read a %1 number'),
      output: 'number',
      inputs: {
        TYPE: {
          menu: [
            [translate('esp32.blocks.serialReadParseInteger', 'int'), 'INT'],
            [translate('esp32.blocks.serialReadParseFloat', 'float'), 'FLOAT'],
          ],
        },
      },
      mpy(block) {
        const type = block.getFieldValue('TYPE') || 'INT';
        this.definitions_['import_uart'] = 'from machine import UART';
        this.definitions_['uart'] = 'uart = UART(0)';
        if (type === 'INT') {
          return [`int(uart.read())`, this.ORDER_FUNCTION_CALL];
        } else if (type === 'FLOAT') {
          return [`float(uart.read())`, this.ORDER_FUNCTION_CALL];
        }
      },
    },
    '---',
    {
      // 读取字节
      id: 'read',
      text: translate('esp32.blocks.serialRead', 'read a byte'),
      output: true,
      mpy(block) {
        this.definitions_['import_uart'] = 'from machine import UART';
        this.definitions_['uart'] = 'uart = UART(0)';
        return [`uart.read(1)`, this.ORDER_FUNCTION_CALL];
      },
    },
    {
      // 读取长度字节
      id: 'read_bytes',
      text: translate('esp32.blocks.serialReadBytes', 'read %1 bytes'),
      output: true,
      inputs: {
        LEN: {
          type: 'integer',
          defaultValue: 2,
        },
      },
      mpy(block) {
        const len = this.valueToCode(block, 'LEN', this.ORDER_NONE);
        this.definitions_['import_uart'] = 'from machine import UART';
        this.definitions_['uart'] = 'uart = UART(0)';
        return [`uart.read(${len})`, this.ORDER_FUNCTION_CALL];
      },
    },
  ],
});
