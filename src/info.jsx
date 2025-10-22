import { addLocalesMessages, Text } from '@blockcode/core';
import { version } from '../package.json';
import featureImage from './feature.png';

addLocalesMessages({
  en: {
    'esp32.name': 'ESP32 Series',
    'esp32.description': 'ESP32 series programming via blocks.',
    'esp32.collaborator': 'Espressif',
  },
  'zh-Hans': {
    'esp32.name': 'ESP32 系列',
    'esp32.description': '用积木为 ESP32 系列主控板編程。',
    'esp32.collaborator': '乐鑫科技',
  },
  'zh-Hant': {
    'esp32.name': 'ESP32 系列',
    'esp32.description': '用積木為 ESP32 系列主控板編程。',
    'esp32.collaborator': 'Espressif',
  },
});

export default {
  version,
  preview: true,
  sortIndex: 101,
  image: featureImage,
  name: (
    <Text
      id="esp32.name"
      defaultMessage="ESP32 Series"
    />
  ),
  description: (
    <Text
      id="esp32.description"
      defaultMessage="ESP32 series programming via blocks."
    />
  ),
  collaborator: (
    <Text
      id="esp32.collaborator"
      defaultMessage="Espressif"
    />
  ),
  blocksRequired: true,
  micropythonRequired: true,
};
