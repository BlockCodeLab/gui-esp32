import { translate, themeColors } from '@blockcode/core';
import { ScratchBlocks } from '@blockcode/blocks';

export default () => ({
  id: 'control',
  name: '%{BKY_CATEGORY_CONTROL}',
  themeColor: themeColors.blocks.control.primary,
  inputColor: themeColors.blocks.control.secondary,
  otherColor: themeColors.blocks.control.tertiary,
  blocks: [
    {
      // 等待
      id: 'wait',
      text: translate('esp32.blocks.wait', 'wait %1 seconds'),
      inputs: {
        seconds: {
          type: 'integer',
          defaultValue: 1,
        },
      },
      esp32(block) {
        const seconds = this.valueToCode(block, 'seconds', this.ORDER_NONE);
        const code = `sleep(${seconds})\n`;
        return code;
      },
    },
    {
      // 无限重复
      id: 'forever',
      text: ScratchBlocks.Msg.CONTROL_FOREVER,
      repeat: true,
      end: true,
      esp32(block) {
        let branchCode = this.statementToCode(block, 'SUBSTACK');
        branchCode = this.addLoopTrap(branchCode, block.id) || this.PASS;
        let code = '';
        code += 'while True:\n';
        code +=  branchCode;
        return code;
      },
    },
    '---',
    {
      // 重复次数
      id: 'repeat',
      text: ScratchBlocks.Msg.CONTROL_REPEAT,
      repeat: true,
      inputs: {
        TIMES: {
          type: 'integer',
          defaultValue: 10,
        },
      },
      esp32(block) {
        const times = this.valueToCode(block, 'TIMES', this.ORDER_NONE);

        let branchCode = this.statementToCode(block, 'SUBSTACK');
        branchCode = this.addLoopTrap(branchCode, block.id) || this.PASS;
        
        let code = '';
        code += `for count in range(int(${times})):\n`;
        code += branchCode;
        code += '\n';
        return code;
      },
    },
    
    '---',
    {
      // 如果
      id: 'if',
      text: ScratchBlocks.Msg.CONTROL_IF,
      substack: true,
      inputs: {
        CONDITION: {
          type: 'boolean',
        },
      },
      esp32(block) {
        const condition = this.valueToCode(block, 'CONDITION', this.ORDER_NONE) || 'False';
        const branchCode = this.statementToCode(block, 'SUBSTACK') || this.PASS;

        let code = '';
        code += `if ${condition}:\n`;
        code += branchCode;
        return code;
      },
    },
    {
      // 否则，如果
      id: 'elseif',
      text: translate('esp32.blocks.elseif', 'else if %1 then'),
      substack: true,
      inputs: {
        CONDITION: {
          type: 'boolean',
        },
      },
      esp32(block) {
        const condition = this.valueToCode(block, 'CONDITION', this.ORDER_NONE) || 'False';
        const branchCode = this.statementToCode(block, 'SUBSTACK') || this.PASS;

        // [TODO] 处理 elseif 前面没有 if 的错误情况
        let code = '';
        code += `elif ${condition}:\n`;
        code += branchCode;
        return code;
      },
    },
    {
      // 否则
      id: 'else',
      text: translate('esp32.blocks.else', 'else'),
      substack: true,
      esp32(block) {
        const branchCode = this.statementToCode(block, 'SUBSTACK') || this.PASS;

        // [TODO] 处理 else 前面没有 if 的错误情况
        let code = '';
        code += `else:\n`;
        code += branchCode;
        return code;
      },
    },
    '---',
    {
      // 重复直到
      id: 'repeat_until',
      text: ScratchBlocks.Msg.CONTROL_REPEATUNTIL,
      repeat: true,
      inputs: {
        CONDITION: {
          type: 'boolean',
        },
      },
      esp32(block) {
        const condition = this.valueToCode(block, 'CONDITION', this.ORDER_NONE) || 'False';
        let branchCode = this.statementToCode(block, 'SUBSTACK') || this.PASS;
        branchCode = this.addLoopTrap(branchCode, block.id);

        let code = '';
        code += `while not ${condition}:\n`;
        code += branchCode;
        return code;
      },
    },
    {
      // 当重复
      id: 'while',
      text: ScratchBlocks.Msg.CONTROL_WHILE,
      repeat: true,
      inputs: {
        CONDITION: {
          type: 'boolean',
        },
      },
      esp32(block) {
        const condition = this.valueToCode(block, 'CONDITION', this.ORDER_NONE) || 'True';
        let branchCode = this.statementToCode(block, 'SUBSTACK') || this.PASS;
        branchCode = this.addLoopTrap(branchCode, block.id);

        let code = '';
        code += `while ${condition}:\n`;
        code += branchCode;
        return code;
      },
    },
    {
      // continue
      id: 'continue',
      text: translate('esp32.blocks.continue', 'continue'),
      end: true,
      esp32(block) {
        let code = '';
        code += 'continue\n';
        return code;
      },
    },
    {
      // break
      id: 'break',
      text: translate('esp32.blocks.break', 'break'),
      end: true,
      esp32(block) {
        let code = '';
        code += 'break\n';
        return code;
      },
    },
  ],
});
