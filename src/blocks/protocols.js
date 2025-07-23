import { translate, themeColors } from '@blockcode/core';

export default () => ({
  id: 'protocol',
  name: translate('esp32.blocks.protocols', 'Protocols'),
  themeColor: themeColors.blocks.sensing.primary,
  inputColor: themeColors.blocks.sensing.secondary,
  otherColor: themeColors.blocks.sensing.tertiary,
  order: 5,
  blocks: [],
});
