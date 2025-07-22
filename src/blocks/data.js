import { translate, themeColors } from '@blockcode/core';
import { ScratchBlocks } from '@blockcode/blocks';

export default () => ({
  id: 'data',
  name: translate('esp32.blocks.data', 'Data'),
  themeColor: themeColors.blocks.monitor.primary,
  inputColor: themeColors.blocks.monitor.secondary,
  otherColor: themeColors.blocks.monitor.tertiary,
  order: 7,
  blocks: [
    {
      // 类型转换
      id: 'convert',
      text: translate('esp32.blocks.dataConvert', 'convert %1 to %2'),
      output: true,
      inputs: {
        DATA: {
          type: 'string',
          defaultValue: '3.1415',
        },
        TYPE: {
          menu: [
            ['esp32.blocks.dataConvert.int', 'int'],
            ['esp32.blocks.dataConvert.float', 'float'],
            ['esp32.blocks.dataConvert.string', 'str'],
            ['esp32.blocks.dataConvert.list', 'list'],
          ],
        },
      },
      mpy(block) {
        const data = this.valueToCode(block, 'DATA', this.ORDER_NONE);
        const type = block.getFieldValue('TYPE') || 'int';
        return [`${type}(${data})`, this.ORDER_FUNCTION_CALL];
      },
    },
    '---',
    {
      // 长度
      id: 'sizeof',
      text: translate('esp32.blocks.dataLengthOf', 'length of %1'),
      output: 'number',
      inputs: {
        DATA: {
          type: 'string',
          defaultValue: 'esp32',
        },
      },
      mpy(block) {
        const data = this.valueToCode(block, 'DATA', this.ORDER_NONE);
        return [`len(${data})`, this.ORDER_FUNCTION_CALL];
      },
    },
    '---',
    {
      // 约束
      id: 'constrain',
      text: translate('esp32.blocks.dataConstrain', 'constrain %1 between %2 to %3'),
      output: 'number',
      inputs: {
        DATA: {
          type: 'integer',
          defaultValue: 0,
        },
        FROM: {
          type: 'integer',
          defaultValue: 0,
        },
        TO: {
          type: 'integer',
          defaultValue: 255,
        },
      },
      mpy(block) {
        const data = this.valueToCode(block, 'DATA', this.ORDER_NONE);
        const from = this.valueToCode(block, 'FROM', this.ORDER_NONE);
        const to = this.valueToCode(block, 'TO', this.ORDER_NONE);
        return [`min(max(${data}, ${from}), ${to})`, this.ORDER_FUNCTION_CALL];
      },
    },
    {
      // 映射
      id: 'map',
      text: translate('esp32.blocks.dataMap', 'map %1 from %2 - %3 to %4 - %5'),
      output: 'number',
      inputs: {
        DATA: {
          type: 'integer',
          defaultValue: 0,
        },
        FROMLOW: {
          type: 'integer',
          defaultValue: 0,
        },
        FROMHIGH: {
          type: 'integer',
          defaultValue: 1023,
        },
        TOLOW: {
          type: 'integer',
          defaultValue: 0,
        },
        TOHIGHT: {
          type: 'integer',
          defaultValue: 255,
        },
      },
      mpy(block) {
        const data = this.valueToCode(block, 'DATA', this.ORDER_NONE);
        const fromlow = this.valueToCode(block, 'FROMLOW', this.ORDER_NONE);
        const fromhigh = this.valueToCode(block, 'FROMHIGH', this.ORDER_NONE);
        const tolow = this.valueToCode(block, 'TOLOW', this.ORDER_NONE);
        const tohigh = this.valueToCode(block, 'TOHIGHT', this.ORDER_NONE);
        const code = `(${data} - ${fromlow}) * (${tohigh} - ${tolow}) // (${fromhigh} - ${fromlow}) + ${tolow}`;
        return [code, this.ORDER_FUNCTION_CALL];
      },
    },
    // 变量积木
    {
      // 声明变量
      id: 'setvariableto',
      mpy(block) {
        const varName = this.getVariableName(block.getFieldValue('VARIABLE'));
        const code = `${varName} = None`;

        // 全局变量
        const rootBlock = block.getRootBlock();
        if (rootBlock.type === 'event_whensetup') {
          this.definitions_[`variable_${varName}`] = code;
          return '';
        }
        // 私有变量
        return code + '\n';
      },
    },
    {
      // 设置变量
      id: 'changevariableby',
      mpy(block) {
        const varName = this.getVariableName(block.getFieldValue('VARIABLE'));
        const varValue = this.valueToCode(block, 'VALUE', this.ORDER_NONE);
        return `${varName} = ${varValue}\n`;
      },
    },
    {
      // 获取变量
      id: 'variable',
      mpy(block) {
        const varName = this.getVariableName(block.getFieldValue('VARIABLE'));
        return [varName, this.ORDER_ATOMIC];
      },
    },
    {
      // 声明数组
      id: 'insertatlist',
      mpy(block) {
        const arrName = 'arr' + this.getVariableName(block.getFieldValue('LIST'));
        const arrSize = this.valueToCode(block, 'INDEX', this.ORDER_NONE);
        const code = `${arrName} = [None] * int(${arrSize})`;

        // 全局变量
        const rootBlock = block.getRootBlock();
        if (rootBlock.type === 'event_whensetup') {
          this.definitions_[`variable_${arrName}`] = code;
          return '';
        }
        // 私有变量
        return code + '\n';
      },
    },
    {
      // 设置数组项
      id: 'replaceitemoflist',
      mpy(block) {
        const arrName = 'arr' + this.getVariableName(block.getFieldValue('LIST'));
        const arrValue = this.valueToCode(block, 'ITEM', this.ORDER_NONE);
        const index = this.valueToCode(block, 'INDEX', this.ORDER_NONE);
        return `${arrName}[int(${index})] = ${arrValue}\n`;
      },
    },
    {
      // 获取数组
      id: 'listcontents',
      mpy(block) {
        const arrName = 'arr' + this.getVariableName(block.getFieldValue('LIST'));
        return [arrName, this.ORDER_ATOMIC];
      },
    },
    {
      // 获取数组项
      id: 'itemoflist',
      mpy(block) {
        const arrName = 'arr' + this.getVariableName(block.getFieldValue('LIST'));
        const index = this.valueToCode(block, 'INDEX', this.ORDER_NONE);
        const code = `${arrName}[int(${index})]`;
        return [code, this.ORDER_MEMBER];
      },
    },
    {
      // 数组长度
      id: 'lengthoflist',
      mpy(block) {
        const arrName = 'arr' + this.getVariableName(block.getFieldValue('LIST'));
        const code = `len(${arrName})`;
        return [code, this.ORDER_FUNCTION_CALL];
      },
    },
  ],
});
