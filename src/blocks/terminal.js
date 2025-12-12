import { translate, themeColors } from '@blockcode/core';

export default (i) => ({
  id: 'terminal',
  name: translate('esp32.blocks.terminal', 'Terminal'),
  themeColor: themeColors.blocks.debug.primary,
  inputColor: themeColors.blocks.debug.secondary,
  order: i,
  blocks: [
    {
      id: 'print',
      text: translate('esp32.blocks.terminalPrint', 'print %1'),
      inputs: {
        STRING: {
          type: 'string',
          defaultValue: 'hello',
        },
      },
      mpy(block) {
        const str = this.valueToCode(block, 'STRING', this.ORDER_NONE);
        const code = `print(str(${str}))\n`;
        return code;
      },
    },
    {
      id: 'eval',
      text: translate('esp32.blocks.terminalEval', 'eval %1'),
      inputs: {
        CODE: {
          type: 'string',
          defaultValue: 'print("hello")',
        },
      },
      mpy(block) {
        let code = this.valueToCode(block, 'CODE', this.ORDER_NONE);
        code = `${code.replace(/^["']/, '').replace(/["']$/, '')}\n`;
        return code;
      },
    },
  ],
});
