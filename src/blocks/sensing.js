import { themeColors, translate } from '@blockcode/core';
import { ScratchBlocks } from '@blockcode/blocks';

export default () => ({
  id: 'sensing',
  name: '%{BKY_CATEGORY_SENSING}',
  themeColor: themeColors.blocks.sensing.primary,
  inputColor: themeColors.blocks.sensing.secondary,
  otherColor: themeColors.blocks.sensing.tertiary,
  blocks: [
    {
      id: 'temperature',
      text: translate('esp32.blocks.temperature', 'temperature'),
      output: 'number',
      mpy(block) {
        this.definitions_['import_esp32'] = 'import esp32';
        const code = '((esp32.raw_temperature() - 32) * 5 / 9)';
        return [code, this.ORDER_ATOMIC];
      },
    },
    '---',
    {
      // 运行时长
      id: 'runtime',
      text: translate('esp32.blocks.runtime', 'run time %1'),
      output: 'number',
      inputs: {
        UNIT: {
          menu: [
            [translate('esp32.blocks.runtimeMilliseconds', 'milliseconds'), 'MS'],
            [translate('esp32.blocks.runtimeSeconds', 'seconds'), 'SEC'],
          ],
        },
      },
      mpy(block) {
        const unit = block.getFieldValue('UNIT');
        let code = 'time.ticks_diff(time.ticks_ms(), _times__)';
        if (unit === 'SEC') {
          code = `(${code} / 1000)`;
        }
        return [code, this.ORDER_ATOMIC];
      },
    },
  ],
});
