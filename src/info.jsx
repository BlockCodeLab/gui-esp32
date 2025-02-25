import { addLocalesMessages, Text } from '@blockcode/core';
import { version } from '../package.json';
import featureImage from './feature.png';

addLocalesMessages({
  en: {
    'esp32.name': 'ESP32 Board',
    'esp32.description': 'Programming the ESP32 board via blocks.',
  },
  'zh-Hans': {
    'esp32.name': 'ESP32 开发板',
    'esp32.description': '用积木为 ESP32 开发板编程。',
  },
  'zh-Hant': {
    'esp32.name': 'ESP32 開發板',
    'esp32.description': '用積木為 ESP32 開發板編程。',
  },
});

export default {
  version,
  disabled: true,
  sortIndex: 101, // 开发板产品
  image: featureImage,
  name: (
    <Text
      id="esp32.name"
      defaultMessage="ESP32 Board"
    />
  ),
  description: (
    <Text
      id="esp32.description"
      defaultMessage="Programming the ESP32 board via blocks."
    />
  ),
  blocksRequired: true,
};
