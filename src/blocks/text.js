import { translate, themeColors } from '@blockcode/core';
import { ScratchBlocks } from '@blockcode/blocks';

export default () => ({
  id: 'text',
  name: translate('esp32.blocks.text', 'Text'),
  themeColor: themeColors.blocks.looks.primary,
  inputColor: themeColors.blocks.looks.secondary,
  otherColor: themeColors.blocks.looks.tertiary,
  order: 1,
  blocks: [
    {
      // 连接
      id: 'join',
      text: ScratchBlocks.Msg.OPERATORS_JOIN,
      output: 'string',
      inputs: {
        STRING1: {
          type: 'string',
          defaultValue: 'hello',
        },
        STRING2: {
          type: 'string',
          defaultValue: 'esp32',
        },
      },
      mpy(block) {
        const str1 = this.valueToCode(block, 'STRING1', this.ORDER_NONE);
        const str2 = this.valueToCode(block, 'STRING2', this.ORDER_NONE);
        const code = `(${str1} + ${str2})`;
        return [code, this.ORDER_ADDITION];
      },
    },
    {
      // 字符
      id: 'letter_of',
      text: ScratchBlocks.Msg.OPERATORS_LETTEROF,
      output: 'string',
      inputs: {
        LETTER: {
          type: 'integer',
          defaultValue: 1,
        },
        STRING: {
          type: 'string',
          defaultValue: 'esp32',
        },
      },
      mpy(block) {
        const letterIndex = this.getAdjustedInt(block, 'LETTER'); // 将位置值换成下标值
        const str = this.valueToCode(block, 'STRING', this.ORDER_NONE);
        const code = `${str}[${letterIndex}]`;
        return [code, this.ORDER_FUNCTION_CALL];
      },
    },
    {
      // 字符长度
      id: 'length',
      text: ScratchBlocks.Msg.OPERATORS_LENGTH,
      output: 'number',
      inputs: {
        STRING: {
          type: 'string',
          defaultValue: 'esp32',
        },
      },
      mpy(block) {
        const str = this.valueToCode(block, 'STRING', this.ORDER_NONE);
        const code = `len(${str})`;
        return [code, this.ORDER_FUNCTION_CALL];
      },
    },
    {
      // 包含
      id: 'contains',
      text: ScratchBlocks.Msg.OPERATORS_CONTAINS,
      output: 'boolean',
      inputs: {
        STRING1: {
          type: 'string',
          defaultValue: 'esp32',
        },
        STRING2: {
          type: 'string',
          defaultValue: 'e',
        },
      },
      mpy(block) {
        const str1 = this.valueToCode(block, 'STRING1', this.ORDER_NONE);
        const str2 = this.valueToCode(block, 'STRING2', this.ORDER_NONE);
        const code = `(${str2} in ${str1})`;
        return [code, this.ORDER_EQUALITY];
      },
    },
    {
      // 相同
      id: 'equals',
      text: translate('esp32.blocks.textEquals', '%1 equals %2 (not case-sensitive)?'),
      output: 'boolean',
      inputs: {
        STRING1: {
          type: 'string',
          defaultValue: 'esp32',
        },
        STRING2: {
          type: 'string',
          defaultValue: 'ESP32',
        },
      },
      mpy(block) {
        const str1 = this.valueToCode(block, 'STRING1', this.ORDER_NONE);
        const str2 = this.valueToCode(block, 'STRING2', this.ORDER_NONE);
        const code = `${str1}.lower() == ${str2}.lower()`;
        return [code, this.ORDER_EQUALITY];
      },
    },
    '---',
    {
      // 删除
      id: 'remove',
      text: translate('esp32.blocks.textRemove', 'remove letters from %1 to %2 of %3'),
      inputs: {
        FROM: {
          type: 'integer',
          defaultValue: 1,
        },
        TO: {
          type: 'integer',
          defaultValue: 2,
        },
        STRING: {
          type: 'string',
          defaultValue: 'esp32',
        },
      },
      mpy(block) {
        const from = this.getAdjustedInt(block, 'FROM');
        const to = this.valueToCode(block, 'TO', this.ORDER_NONE);
        const str = this.valueToCode(block, 'STRING', this.ORDER_NONE);
        const code = `${str}[:${from}] + ${str}[${to}:]\n`;
        return code;
      },
    },
    {
      // 替换
      id: 'replace',
      text: translate('esp32.blocks.textReplace', 'replace %1 of %2 with %3'),
      inputs: {
        STRING1: {
          type: 'string',
          defaultValue: 'a',
        },
        STRING2: {
          type: 'string',
          defaultValue: 'esp32',
        },
        STRING3: {
          type: 'string',
          defaultValue: 'The A',
        },
      },
      mpy(block) {
        const str1 = this.valueToCode(block, 'STRING1', this.ORDER_NONE);
        const str2 = this.valueToCode(block, 'STRING2', this.ORDER_NONE);
        const str3 = this.valueToCode(block, 'STRING3', this.ORDER_NONE);
        const code = `${str2}.replace(${str1}, ${str3})\n`;
        return code;
      },
    },
    {
      // 替换字符
      id: 'replace_letter',
      text: translate('esp32.blocks.textReplaceLetter', 'replace letter %1 of %2 with %3'),
      inputs: {
        INDEX: {
          type: 'integer',
          defaultValue: 1,
        },
        STRING: {
          type: 'string',
          defaultValue: 'esp32',
        },
        LETTER: {
          type: 'string',
          defaultValue: 'A',
        },
      },
      mpy(block) {
        const index = this.getAdjustedInt(block, 'INDEX');
        const str = this.valueToCode(block, 'STRING', this.ORDER_NONE);
        const letter = this.valueToCode(block, 'LETTER', this.ORDER_NONE);
        const code = `${str}[:${index}] + ${letter} + ${str}[${index + 1}:]\n`;
        return code;
      },
    },
    {
      // 截取
      id: 'substring',
      text: translate('esp32.blocks.textSubstring', 'substring of %1 from %2 to %3'),
      output: 'string',
      inputs: {
        STRING: {
          type: 'string',
          defaultValue: 'esp32',
        },
        FROM: {
          type: 'integer',
          defaultValue: 5,
        },
        TO: {
          type: 'integer',
          defaultValue: 7,
        },
      },
      mpy(block) {
        const from = this.getAdjustedInt(block, 'FROM');
        const to = this.valueToCode(block, 'TO', this.ORDER_NONE);
        const str = this.valueToCode(block, 'STRING', this.ORDER_NONE);
        const code = `${str}[${from}:${to}]`;
        return [code, this.ORDER_FUNCTION_CALL];
      },
    },
    {
      // 开始/结束于
      id: 'with',
      text: translate('esp32.blocks.textWith', '%1 %2 with %3 ?'),
      output: 'boolean',
      inputs: {
        STRING1: {
          type: 'string',
          defaultValue: 'esp32',
        },
        WITH: {
          type: 'string',
          menu: [
            [translate('esp32.blocks.textStartsWith', 'starts'), 'START'],
            [translate('esp32.blocks.textEndsWith', 'ends'), 'END'],
          ],
        },
        STRING2: {
          type: 'string',
          defaultValue: 'a',
        },
      },
      mpy(block) {
        const str1 = this.valueToCode(block, 'STRING1', this.ORDER_NONE);
        const str2 = this.valueToCode(block, 'STRING2', this.ORDER_NONE);
        const with_ = block.getFieldValue('WITH') || 'START';
        const method = with_ === 'START' ? 'startswith' : 'endswith';
        const code = `${str1}.${method}(${str2})`;
        return [code, this.ORDER_FUNCTION_CALL];
      },
    },
    '---',
    {
      // 转换大小写
      id: 'case',
      text: translate('esp32.blocks.textCase', 'get %1 case of %2'),
      inputs: {
        WITH: {
          menu: [
            [translate('esp32.blocks.textLowerCase', 'lower'), 'LOWER'],
            [translate('esp32.blocks.textUpperCase', 'upper'), 'UPPER'],
          ],
        },
        STRING: {
          type: 'string',
          defaultValue: 'ESP32',
        },
      },
      mpy(block) {
        const with_ = block.getFieldValue('WITH') || 'LOWER';
        const str = this.valueToCode(block, 'STRING', this.ORDER_NONE);
        const method = with_ === 'LOWER' ? 'lower' : 'upper';
        const code = `${str}.${method}()\n`;
        return code;
      },
    },
    {
      // 清除空白
      id: 'trim',
      text: translate('esp32.blocks.textTrim', 'remove %1 leading and trailing whitespace'),
      inputs: {
        STRING: {
          type: 'string',
          defaultValue: 'esp32',
        },
      },
      mpy(block) {
        const str = this.valueToCode(block, 'STRING', this.ORDER_NONE);
        const code = `${str}.strip()`;
        return code;
      },
    },
    '---',
    {
      // 转换
      id: 'convert',
      text: translate('esp32.blocks.textConvert', 'convert %1 to %2'),
      output: true,
      inputs: {
        STRING: {
          type: 'string',
          defaultValue: 'a',
        },
        TYPE: {
          menu: [
            [translate('esp32.blocks.dataConvert.int', 'int'), 'int'],
            [translate('esp32.blocks.dataConvert.float', 'float'), 'float'],
            [translate('esp32.blocks.dataConvert.list', 'list'), 'list'],
          ],
        },
      },
      mpy(block) {
        const str = this.valueToCode(block, 'STRING', this.ORDER_NONE);
        const type = block.getFieldValue('TYPE') || 'int';
        return [`${type}(${str})`, this.ORDER_FUNCTION_CALL];
      },
    },
    {
      // 转换为文本
      id: 'convert_from',
      text: translate('esp32.blocks.textConvertFrom', 'convert %1 to String'),
      output: true,
      inputs: {
        NUM: {
          type: 'number',
          defaultValue: 1,
        },
      },
      mpy(block) {
        const num = this.valueToCode(block, 'NUM', this.ORDER_NONE);
        const code = `str(${num})`;
        return [code, this.ORDER_FUNCTION_CALL];
      },
    },
  ],
});
