import { translate, themeColors } from '@blockcode/core';
import { ESP32Boards } from '../lib/boards';

export default (boardType, i) => ({
  id: 'camera',
  name: translate('esp32.blocks.camera', 'Camera'),
  themeColor: themeColors.blocks.looks.primary,
  inputColor: themeColors.blocks.looks.secondary,
  otherColor: themeColors.blocks.looks.tertiary,
  order: i,
  blocks: [
    {
      id: 'capture',
      text: translate('esp32.blocks.cameraCapture', 'capture'),
      output: 'raw',
      mpy(block) {
        this.definitions_['import_camera'] = 'import camera';
        this.definitions_['camera_init'] = this.definitions_['camera_init'] ?? 'camera.init()';
        const code = 'camera.capture()';
        return [code, this.ORDER_FUNCTION_CALL];
      },
    },
    '---',
    boardType === ESP32Boards.ESP32S3_CAM && {
      id: 'flashlamp',
      text: translate('esp32.blocks.cameraFlashlamp', 'flashlamp %1'),
      inputs: {
        STATUS: {
          menu: 'Status',
        },
      },
      mpy(block) {
        const status = this.valueToCode(block, 'STATUS', this.ORDER_NONE);
        this.definitions_['import_camera'] = 'import camera';
        this.definitions_['camera_init'] = this.definitions_['camera_init'] ?? 'camera.init()';
        const code = `camera.flashlamp(${status})\n`;
        return code;
      },
    },
    {
      id: 'effect',
      text: translate('esp32.blocks.cameraEffect', 'set effect to %1'),
      inputs: {
        EFFECT: {
          menu: 'Effect',
        },
      },
      mpy(block) {
        const effect = block.getFieldValue('EFFECT') || 'EFFECT_NONE';
        this.definitions_['import_camera'] = 'import camera';
        this.definitions_['camera_init'] = this.definitions_['camera_init'] ?? 'camera.init()';
        const code = `camera.speffect(camera.${effect})\n`;
        return code;
      },
    },
    {
      id: 'flip',
      text: translate('esp32.blocks.cameraFlip', 'flip %1'),
      inputs: {
        STATUS: {
          menu: 'Status',
        },
      },
      mpy(block) {
        const status = this.valueToCode(block, 'STATUS', this.ORDER_NONE);
        this.definitions_['import_camera'] = 'import camera';
        this.definitions_['camera_init'] = this.definitions_['camera_init'] ?? 'camera.init()';
        const code = `camera.flip(${status})\n`;
        return code;
      },
    },
    {
      id: 'mirror',
      text: translate('esp32.blocks.cameraMirror', 'mirror %1'),
      inputs: {
        STATUS: {
          menu: 'Status',
        },
      },
      mpy(block) {
        const status = this.valueToCode(block, 'STATUS', this.ORDER_NONE);
        this.definitions_['import_camera'] = 'import camera';
        this.definitions_['camera_init'] = this.definitions_['camera_init'] ?? 'camera.init()';
        const code = `camera.mirror(${status})\n`;
        return code;
      },
    },
    '---',
    {
      id: 'framesize',
      text: translate('esp32.blocks.cameraFramesize', 'set framesize to %1'),
      inputs: {
        FRAMESIZE: {
          menu: 'Framesize',
        },
      },
      mpy(block) {
        const framesize = block.getFieldValue('FRAMESIZE') || 'FRAME_VGA';
        this.definitions_['import_camera'] = 'import camera';
        this.definitions_['camera_init'] = this.definitions_['camera_init'] ?? 'camera.init()';
        const code = `camera.framesize(camera.${framesize})\n`;
        return code;
      },
    },
    {
      id: 'format',
      text: translate('esp32.blocks.cameraFormat', 'set picture format to %1'),
      inputs: {
        FORMAT: {
          menu: 'Format',
        },
      },
      mpy(block) {
        const format = block.getFieldValue('FORMAT') || 'JPEG';
        this.definitions_['import_camera'] = 'import camera';
        this.definitions_['camera_init'] = `camera.init(format=camera.${format})`;
        return '';
      },
    },
    {
      id: 'quality',
      text: translate('esp32.blocks.cameraQuality', 'set picture quality to %1'),
      inputs: {
        RANGE: {
          shadow: 'rangeQuality',
        },
      },
      mpy(block) {
        const range = this.valueToCode(block, 'RANGE', this.ORDER_NONE);
        this.definitions_['import_camera'] = 'import camera';
        this.definitions_['camera_init'] = this.definitions_['camera_init'] ?? 'camera.init()';
        const code = `camera.quality(${range})\n`;
        return code;
      },
    },
    {
      id: 'contrast',
      text: translate('esp32.blocks.cameraContrast', 'set contrast to %1'),
      inputs: {
        RANGE: {
          shadow: 'range22',
        },
      },
      mpy(block) {
        const range = this.valueToCode(block, 'RANGE', this.ORDER_NONE);
        this.definitions_['import_camera'] = 'import camera';
        this.definitions_['camera_init'] = this.definitions_['camera_init'] ?? 'camera.init()';
        const code = `camera.contrast(${range})\n`;
        return code;
      },
    },
    {
      id: 'saturation',
      text: translate('esp32.blocks.cameraSaturation', 'set saturation to %1'),
      inputs: {
        RANGE: {
          shadow: 'range22',
        },
      },
      mpy(block) {
        const range = this.valueToCode(block, 'RANGE', this.ORDER_NONE);
        this.definitions_['import_camera'] = 'import camera';
        this.definitions_['camera_init'] = this.definitions_['camera_init'] ?? 'camera.init()';
        const code = `camera.saturation(${range})\n`;
        return code;
      },
    },
    {
      id: 'brightness',
      text: translate('esp32.blocks.cameraBrightness', 'set brightness to %1'),
      inputs: {
        RANGE: {
          shadow: 'range22',
        },
      },
      mpy(block) {
        const range = this.valueToCode(block, 'RANGE', this.ORDER_NONE);
        this.definitions_['import_camera'] = 'import camera';
        this.definitions_['camera_init'] = this.definitions_['camera_init'] ?? 'camera.init()';
        const code = `camera.brightness(${range})\n`;
        return code;
      },
    },
    {
      id: 'whitebalance',
      text: translate('esp32.blocks.cameraWhiteBalance', 'set white balance to %1'),
      inputs: {
        WB: {
          menu: 'WhiteBalance',
        },
      },
      mpy(block) {
        const wb = block.getFieldValue('WB') || 'WB_NONE';
        this.definitions_['import_camera'] = 'import camera';
        this.definitions_['camera_init'] = this.definitions_['camera_init'] ?? 'camera.init()';
        const code = `camera.whitebalance(camera.${wb})\n`;
        return code;
      },
    },
    {
      id: 'range22',
      shadow: true,
      output: 'number',
      inputs: {
        RANGE: {
          type: 'slider',
          defaultValue: 0,
          min: -2,
          max: 2,
        },
      },
      mpy(block) {
        const range = block.getFieldValue('RANGE') || 0;
        return [range, this.ORDER_NONE];
      },
    },
    {
      id: 'rangeQuality',
      shadow: true,
      output: 'number',
      inputs: {
        RANGE: {
          type: 'slider',
          defaultValue: 12,
          min: 0,
          max: 63,
        },
      },
      mpy(block) {
        const range = block.getFieldValue('RANGE') || 12;
        return [range, this.ORDER_NONE];
      },
    },
  ].filter(Boolean),
  menus: {
    Status: {
      inputMode: true,
      defaultValue: '1',
      type: 'integer',
      items: [
        [translate('esp32.blocks.turnon', 'on'), '1'],
        [translate('esp32.blocks.turnoff', 'off'), '0'],
      ],
    },
    Effect: {
      items: [
        [translate('esp32.blocks.cameraEffectNone', 'none'), 'EFFECT_NONE'],
        [translate('esp32.blocks.cameraEffectNegative', 'negative'), 'EFFECT_NEGATIVE'],
        [translate('esp32.blocks.cameraEffectGrayscale', 'grayscale'), 'EFFECT_GRAYSCALE'],
        [translate('esp32.blocks.cameraEffectSepia', 'sepia'), 'EFFECT_SEPIA'],
        [translate('esp32.blocks.cameraEffectRed', 'red'), 'EFFECT_RED'],
        [translate('esp32.blocks.cameraEffectGreen', 'green'), 'EFFECT_GREEN'],
        [translate('esp32.blocks.cameraEffectBlue', 'blue'), 'EFFECT_BLUE'],
        [translate('esp32.blocks.cameraEffectAntique', 'antique'), 'EFFECT_ANTIQUE'],
        [translate('esp32.blocks.cameraEffectSketch', 'sketch'), 'EFFECT_SKETCH'],
        [translate('esp32.blocks.cameraEffectSolarize', 'solarize'), 'EFFECT_SOLARIZE'],
        [translate('esp32.blocks.cameraEffectPosterize', 'posterize'), 'EFFECT_POSTERIZE'],
        [translate('esp32.blocks.cameraEffectWhiteboard', 'whiteboard'), 'EFFECT_WHITEBOARD'],
        [translate('esp32.blocks.cameraEffectBlackboard', 'blackboard'), 'EFFECT_BLACKBOARD'],
        [translate('esp32.blocks.cameraEffectAqua', 'aqua'), 'EFFECT_AQUA'],
      ],
    },
    Framesize: {
      items: [
        [translate('esp32.blocks.cameraFramesize96X96', '96×96'), 'FRAME_96X96'],
        [translate('esp32.blocks.cameraFramesizeQQVGA', '160×120'), 'FRAME_QQVGA'],
        [translate('esp32.blocks.cameraFramesizeQCIF', '176×144'), 'FRAME_QCIF'],
        [translate('esp32.blocks.cameraFramesizeHQVGA', '240×160'), 'FRAME_HQVGA'],
        [translate('esp32.blocks.cameraFramesize240X240', '240×240'), 'FRAME_240X240'],
        [translate('esp32.blocks.cameraFramesizeQVGA', '320×240'), 'FRAME_QVGA'],
        [translate('esp32.blocks.cameraFramesizeCIF', '352×288'), 'FRAME_CIF'],
        [translate('esp32.blocks.cameraFramesizeHVGA', '480×320'), 'FRAME_HVGA'],
        [translate('esp32.blocks.cameraFramesizeVGA', '640×480'), 'FRAME_VGA'],
        [translate('esp32.blocks.cameraFramesizeSVGA', '800×600'), 'FRAME_SVGA'],
        [translate('esp32.blocks.cameraFramesizeXGA', '1024×768'), 'FRAME_XGA'],
        [translate('esp32.blocks.cameraFramesizeHD', '1280×720'), 'FRAME_HD'],
        [translate('esp32.blocks.cameraFramesizeSXGA', '1280×1024'), 'FRAME_SXGA'],
        [translate('esp32.blocks.cameraFramesizeUXGA', '1900×1200'), 'FRAME_UXGA'],
        [translate('esp32.blocks.cameraFramesizeFHD', '1920×1080'), 'FRAME_FHD'],
        [translate('esp32.blocks.cameraFramesizePHD', '2560×1440'), 'FRAME_P_HD'],
        [translate('esp32.blocks.cameraFramesizeP3MP', '2048×1536'), 'FRAME_P_3MP'],
        [translate('esp32.blocks.cameraFramesizeQXGA', '2048×1536'), 'FRAME_QXGA'],
        [translate('esp32.blocks.cameraFramesizeQHD', '2560×1440'), 'FRAME_QHD'],
        [translate('esp32.blocks.cameraFramesizeWQXGA', '2560×1600'), 'FRAME_WQXGA'],
        [translate('esp32.blocks.cameraFramesizePFHD', '2560×1600'), 'FRAME_P_FHD'],
        [translate('esp32.blocks.cameraFramesizeQSXGA', '2560×2048'), 'FRAME_QSXGA'],
      ],
    },
    Format: {
      items: [
        [translate('esp32.blocks.cameraFormatJPEG', 'JPEG'), 'JPEG'],
        [translate('esp32.blocks.cameraFormatYUV422', 'YUV422'), 'YUV422'],
        [translate('esp32.blocks.cameraFormatRGB565', 'RGB565'), 'RGB565'],
        [translate('esp32.blocks.cameraFormatGrayscale', 'Grayscale'), 'GRAYSCALE'],
      ],
    },
    WhiteBalance: {
      items: [
        [translate('esp32.blocks.cameraWBNone', 'none'), 'WB_NONE'],
        [translate('esp32.blocks.cameraWBSunny', 'sunny'), 'WB_SUNNY'],
        [translate('esp32.blocks.cameraWBCloudy', 'cloudy'), 'WB_CLOUDY'],
        [translate('esp32.blocks.cameraWBOffice', 'office'), 'WB_OFFICE'],
        [translate('esp32.blocks.cameraWBHome', 'home'), 'WB_HOME'],
      ],
    },
  },
});
