import { translate, themeColors } from '@blockcode/core';
import { ScratchBlocks } from '@blockcode/blocks';

export default (classicEvents) => {
 

  return {
    id: 'event',
    name: '%{BKY_CATEGORY_EVENTS}',
    themeColor: themeColors.blocks.events.primary,
    inputColor: themeColors.blocks.events.secondary,
    otherColor: themeColors.blocks.events.tertiary,
    blocks: [
      {
        label: translate('esp32.blocks.classicEventsLabel', 'Classic events turned on from Edit.'),
        hidden: classicEvents,
      },
      {
        // setup 函数
        id: 'whensetup',
        text: translate('esp32.blocks.whensetup', 'when esp32 setup'),
        hat: true,
        esp32(block) {
          const branchCode = this.statementToCode(block) || '';
          this.setup_ += branchCode;
        },
      },
    ],
  };
};
