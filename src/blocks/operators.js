import { translate, themeColors } from '@blockcode/core';
import { ScratchBlocks } from '@blockcode/blocks';
export default () => ({
  id: 'operator',
  name: '%{BKY_CATEGORY_OPERATORS}',
  themeColor: themeColors.blocks.operators.primary,
  inputColor: themeColors.blocks.operators.secondary,
  otherColor: themeColors.blocks.operators.tertiary,
  blocks: [
    {
      // 运算
      id: 'calculate',
      text: '%1 %2 %3',
      output: 'number',
      inputs: {
        NUM1: {
          type: 'number',
          defaultValue: 0,
        },
        SYMBOL: {
          menu: [
            ['+', '+'],
            ['-', '-'],
            ['×', '*'],
            ['÷', '/'],
          ],
        },
        NUM2: {
          type: 'number',
          defaultValue: 0,
        },
      },
      mpy(block) {
        const num1 = this.valueToCode(block, 'NUM1', this.ORDER_NONE);
        const num2 = this.valueToCode(block, 'NUM2', this.ORDER_NONE);
        const symbol = block.getFieldValue('SYMBOL') || '+';

        const orders = {
          '+': this.ORDER_ADDITION,
          '-': this.ORDER_SUBTRACTION,
          '*': this.ORDER_MULTIPLICATION,
          '/': this.ORDER_DIVISION,
        };
        const code = `(${num1} ${symbol} ${num2})`;
        return [code, orders[symbol]];
      },
    },
    '---',
    {
      // 随机
      id: 'random',
      text: ScratchBlocks.Msg.OPERATORS_RANDOM,
      output: 'number',
      inputs: {
        FROM: {
          type: 'integer',
          defaultValue: 1,
        },
        TO: {
          type: 'integer',
          defaultValue: 10,
        },
      },
      mpy(block) {
        this.definitions_['random'] = 'import random';
        const from = this.valueToCode(block, 'FROM', this.ORDER_NONE);
        const to = this.valueToCode(block, 'TO', this.ORDER_NONE);
        const code = `random.randint(${from}, ${to})`;
        return [code, this.ORDER_FUNCTION_CALL];
      },
    },
    '---',
    {
      // 比较
      id: 'compare',
      text: '%1 %2 %3',
      output: 'boolean',
      inputs: {
        NUM1: {
          type: 'number',
          defaultValue: 0,
        },
        SYMBOL: {
          menu: [
            ['>', '>'],
            ['<', '<'],
            ['=', '=='],
            ['≥', '>='],
            ['≤', '<='],
            ['≠', '!='],
          ],
        },
        NUM2: {
          type: 'number',
          defaultValue: 0,
        },
      },
      mpy(block) {
        const num1 = this.valueToCode(block, 'NUM1', this.ORDER_NONE);
        const num2 = this.valueToCode(block, 'NUM2', this.ORDER_NONE);
        const symbol = block.getFieldValue('SYMBOL') || '>';

        const orders = {
          '>': this.ORDER_RELATIONAL,
          '<': this.ORDER_RELATIONAL,
          '==': this.ORDER_EQUALITY,
          '>=': this.ORDER_RELATIONAL,
          '<=': this.ORDER_RELATIONAL,
          '!=': this.ORDER_EQUALITY,
        };
        const code = `(${num1} ${symbol} ${num2})`;
        return [code, orders[symbol]];
      },
    },
    '---',
    {
      // 与
      id: 'and',
      text: ScratchBlocks.Msg.OPERATORS_AND,
      output: 'boolean',
      inputs: {
        OPERAND1: {
          type: 'boolean',
        },
        OPERAND2: {
          type: 'boolean',
        },
      },
      mpy(block) {
        const operand1 = this.valueToCode(block, 'OPERAND1', this.ORDER_NONE);
        const operand2 = this.valueToCode(block, 'OPERAND2', this.ORDER_NONE);
        const code = `(${operand1} and ${operand2})`;
        return [code, this.ORDER_LOGICAL_AND];
      },
    },
    {
      // 或
      id: 'or',
      text: ScratchBlocks.Msg.OPERATORS_OR,
      output: 'boolean',
      inputs: {
        OPERAND1: {
          type: 'boolean',
        },
        OPERAND2: {
          type: 'boolean',
        },
      },
      mpy(block) {
        const operand1 = this.valueToCode(block, 'OPERAND1', this.ORDER_NONE);
        const operand2 = this.valueToCode(block, 'OPERAND2', this.ORDER_NONE);
        const code = `(${operand1} or ${operand2})`;
        return [code, this.ORDER_LOGICAL_OR];
      },
    },
    {
      // 非
      id: 'not',
      text: ScratchBlocks.Msg.OPERATORS_NOT,
      output: 'boolean',
      inputs: {
        OPERAND: {
          type: 'boolean',
        },
      },
      mpy(block) {
        const operand = this.valueToCode(block, 'OPERAND', this.ORDER_NONE) || 'True';
        const code = `(not ${operand})`;
        return [code, this.ORDER_LOGICAL_NOT];
      },
    },
    '---',
    {
      // 位运算
      id: 'bitwise',
      text: '%1 %2 %3',
      output: 'number',
      inputs: {
        NUM1: {
          type: 'integer',
          defaultValue: 0,
        },
        SYMBOL: {
          menu: [
            ['&', '&'],
            ['|', '|'],
            ['^', '^'],
            ['<<', '<<'],
            ['>>', '>>'],
          ],
        },
        NUM2: {
          type: 'integer',
          defaultValue: 0,
        },
      },
      mpy(block) {
        const num1 = this.valueToCode(block, 'NUM1', this.ORDER_NONE);
        const num2 = this.valueToCode(block, 'NUM2', this.ORDER_NONE);
        const symbol = block.getFieldValue('SYMBOL') || '&';

        const orders = {
          '&': this.ORDER_BITWISE_AND,
          '|': this.ORDER_BITWISE_OR,
          '^': this.ORDER_BITWISE_XOR,
          '<<': this.ORDER_BITWISE_SHIFT,
          '>>': this.ORDER_BITWISE_SHIFT,
        };
        const code = `(${num1} ${symbol} ${num2})`;
        return [code, orders[symbol]];
      },
    },
    {
      // 位运算非
      id: 'bitwise_not',
      text: '~ %1',
      output: 'number',
      inputs: {
        NUM: {
          type: 'integer',
          defaultValue: 0,
        },
      },
      mpy(block) {
        const num = this.valueToCode(block, 'NUM', this.ORDER_NONE);
        const code = `(~${num})`;
        return [code, this.ORDER_BITWISE_NOT];
      },
    },
    '---',
    {
      // 最大值
      id: 'larger',
      text: translate('esp32.blocks.operatorLarger', 'larger of %1 and %2'),
      output: 'number',
      inputs: {
        NUM1: {
          type: 'number',
          defaultValue: 0,
        },
        NUM2: {
          type: 'number',
          defaultValue: 0,
        },
      },
      mpy(block) {
        const num1 = this.valueToCode(block, 'NUM1', this.ORDER_NONE);
        const num2 = this.valueToCode(block, 'NUM2', this.ORDER_NONE);
        const code = `max(${num1}, ${num2})`;
        return [code, this.ORDER_FUNCTION_CALL];
      },
    },
    {
      // 最小值
      id: 'smaller',
      text: translate('esp32.blocks.operatorSmaller', 'smaller of %1 and %2'),
      output: 'number',
      inputs: {
        NUM1: {
          type: 'number',
          defaultValue: 0,
        },
        NUM2: {
          type: 'number',
          defaultValue: 0,
        },
      },
      mpy(block) {
        const num1 = this.valueToCode(block, 'NUM1', this.ORDER_NONE);
        const num2 = this.valueToCode(block, 'NUM2', this.ORDER_NONE);
        const code = `min(${num1}, ${num2})`;
        return [code, this.ORDER_FUNCTION_CALL];
      },
    },
    {
      // 余数
      id: 'mod',
      text: ScratchBlocks.Msg.OPERATORS_MOD,
      output: 'number',
      inputs: {
        NUM1: {
          type: 'integer',
          defaultValue: 0,
        },
        NUM2: {
          type: 'integer',
          defaultValue: 0,
        },
      },
      mpy(block) {
        const num1 = this.valueToCode(block, 'NUM1', this.ORDER_NONE);
        const num2 = this.valueToCode(block, 'NUM2', this.ORDER_NONE);
        const code = `(${num1} % ${num2})`;
        return [code, this.ORDER_MODULUS];
      },
    },
    {
      // 四舍五入
      id: 'round',
      text: ScratchBlocks.Msg.OPERATORS_ROUND,
      output: 'number',
      inputs: {
        NUM: {
          type: 'number',
          defaultValue: 0,
        },
      },
      mpy(block) {
        this.definitions_['math'] = 'import math';
        const num = this.valueToCode(block, 'NUM', this.ORDER_NONE);
        const code = `round(${num})`;
        return [code, this.ORDER_FUNCTION_CALL];
      },
    },
    '---',
    {
      // 函数
      id: 'mathop',
      text: ScratchBlocks.Msg.MATHOP,
      output: 'number',
      inputs: {
        OPERATOR: {
          menu: [
            [ScratchBlocks.Msg.OPERATORS_MATHOP_ABS, 'math.fabs'],
            [ScratchBlocks.Msg.OPERATORS_MATHOP_FLOOR, 'math.floor'],
            [ScratchBlocks.Msg.OPERATORS_MATHOP_CEILING, 'math.ceil'],
            [ScratchBlocks.Msg.OPERATORS_MATHOP_SQRT, 'math.sqrt'],
            [ScratchBlocks.Msg.OPERATORS_MATHOP_SIN, 'math.sin'],
            [ScratchBlocks.Msg.OPERATORS_MATHOP_COS, 'math.cos'],
            [ScratchBlocks.Msg.OPERATORS_MATHOP_TAN, 'math.tan'],
            [ScratchBlocks.Msg.OPERATORS_MATHOP_ASIN, 'math.asin'],
            [ScratchBlocks.Msg.OPERATORS_MATHOP_ACOS, 'math.acos'],
            [ScratchBlocks.Msg.OPERATORS_MATHOP_ATAN, 'math.atan'],
            [ScratchBlocks.Msg.OPERATORS_MATHOP_LN, 'math.log'],
            [ScratchBlocks.Msg.OPERATORS_MATHOP_LOG, 'math.log10'],
            [ScratchBlocks.Msg.OPERATORS_MATHOP_EEXP, 'math.exp'],
            [ScratchBlocks.Msg.OPERATORS_MATHOP_10EXP, 'pow10'],
          ],
        },
        NUM: {
          type: 'integer',
          defaultValue: 0,
        },
      },
      mpy(block) {
        this.definitions_['math'] = 'import math';
        const operator = block.getFieldValue('OPERATOR') || 'abs';
        const num = this.valueToCode(block, 'NUM', this.ORDER_NONE);

        let code = '';
        if (operator === 'pow10') {
          code += `math.pow(10, ${num})`;
        } else {
          code += `${operator}(${num})`;
        }
        return [code, this.ORDER_FUNCTION_CALL];
      },
    },
  ],
});
