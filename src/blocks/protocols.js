import { translate, themeColors } from '@blockcode/core';

export default () => ({
  id: 'protocol',
  name: translate('esp32.blocks.protocols', 'Protocols'),
  themeColor: themeColors.blocks.sensing.primary,
  inputColor: themeColors.blocks.sensing.secondary,
  otherColor: themeColors.blocks.sensing.tertiary,
  order: 5,
  blocks: [
    // SPI相关积木
    {
      id: 'spi_init',
      text: translate('esp32.blocks.spiInit', 'init SPI %1 freq:%2Hz'),
      inputs: {
        INTERFACE: {
          menu: [
            [translate('esp32.blocks.spiHSPI', 'HSPI'), 'HSPI'],
            [translate('esp32.blocks.spiVSPI', 'VSPI'), 'VSPI'],
          ],
        },
        FREQ: {
          menu: {
            inputMode: true,
            type: 'integer',
            defaultValue: '1000000',
            items: ['1000000', '5000000', '10000000', '20000000'],
          },
        },
      },
      mpy(block) {
        const iface = block.getFieldValue('INTERFACE') || 'HSPI';
        const freq = this.valueToCode(block, 'FREQ', this.ORDER_NONE);
        const spiId = iface === 'HSPI' ? 1 : 2;
        this.definitions_['import_spi'] = 'from machine import SPI';
        this.definitions_[`${iface}`] = `${iface} = SPI(${spiId}, baudrate=${freq})`;
        return '';
      },
    },
    {
      id: 'spi_write',
      text: translate('esp32.blocks.spiWrite', 'SPI %1 write %2'),
      inputs: {
        INSTANCE: {
          menu: [
            [translate('esp32.blocks.spiHSPI', 'HSPI'), 'HSPI'],
            [translate('esp32.blocks.spiVSPI', 'VSPI'), 'VSPI'],
          ],
        },
        DATA: {
        type: 'string',
        defaultValue: '0x00',
      },
      },
      mpy(block) {
        const instance = block.getFieldValue('INSTANCE') || 'hspi';
        const data = this.valueToCode(block, 'DATA', this.ORDER_ATOMIC);
        return `${instance}.write(${data})`;
      },
    },
    {
      id: 'spi_read',
      text: translate('esp32.blocks.spiRead', 'SPI %1 read %2 bytes'),
      inputs: {
        INSTANCE: {
          menu: [
            [translate('esp32.blocks.spiHSPI', 'HSPI'), 'HSPI'],
            [translate('esp32.blocks.spiVSPI', 'VSPI'), 'VSPI'],
          ],
        },
        LENGTH: {
          type: 'integer',
          defaultValue: '1',
        },
      },
      mpy(block) {
        const instance = block.getFieldValue('INSTANCE') || 'hspi';
        const length = this.valueToCode(block, 'LENGTH', this.ORDER_ATOMIC);
        return `${instance}.read(${length})`;
      },
    },
    '---',
    // I2C相关积木
    {
      id: 'i2c_init',
      text: translate('esp32.blocks.i2cInit', 'init I2C SDA:%1 SCL:%2 freq:%3Hz'),
      inputs: {
        SDA: {
          menu: {
            inputMode: true,
            type: 'integer',
            defaultValue: '21',
            items: ['21', '4', '16'],
          },
        },
        SCL: {
          menu: {
            inputMode: true,
            type: 'integer',
            defaultValue: '22',
            items: ['22', '18', '17'],
          },
        },
        FREQ: {
          menu: {
            inputMode: true,
            type: 'integer',
            defaultValue: '100000',
            items: ['100000', '400000', '1000000'],
          },
        },
      },
      mpy(block) {
        const sda = this.valueToCode(block, 'SDA', this.ORDER_NONE);
        const scl = this.valueToCode(block, 'SCL', this.ORDER_NONE);
        const freq = this.valueToCode(block, 'FREQ', this.ORDER_NONE);
        this.definitions_['import_i2c'] = 'from machine import I2C, Pin';
        this.definitions_['i2c'] = `i2c = I2C(0, sda=Pin(${sda}), scl=Pin(${scl}), freq=${freq})`;
        return '';
      },
    },
    {
      id: 'i2c_scan',
      text: translate('esp32.blocks.i2cScan', 'I2C scan devices'),
      output: 'string',
      mpy() {
        return [`i2c.scan()`, this.ORDER_FUNCTION_CALL];
      },
    },
    {
      id: 'i2c_write',
      text: translate('esp32.blocks.i2cWrite', 'I2C write to %1: %2'),
      inputs: {
        ADDR: {
          type: 'integer',
          defaultValue: '0x48',
        },
        DATA: {
          type: 'string',
          defaultValue: '0x00',
        },
      },
      mpy(block) {
        const addr = this.valueToCode(block, 'ADDR', this.ORDER_NONE);
        const data = this.valueToCode(block, 'DATA', this.ORDER_NONE);
        return `i2c.writeto(${addr}, bytes([${data}]))\n`;
      },
    },
    {
      id: 'i2c_read',
      text: translate('esp32.blocks.i2cRead', 'I2C read from %1: %2 bytes'),
      inputs: {
        ADDR: {
          type: 'integer',
          defaultValue: '0x48',
        },
        LEN: {
          type: 'integer',
          defaultValue: '1',
        },
      },
      output: 'string',
      mpy(block) {
        const addr = this.valueToCode(block, 'ADDR', this.ORDER_NONE);
        const len = this.valueToCode(block, 'LEN', this.ORDER_NONE);
        return [`i2c.readfrom(${addr}, ${len})`, this.ORDER_FUNCTION_CALL];
      },
    },
    '---',
    // I2S相关积木
    {
      id: 'i2s_init',
      text: translate('esp32.blocks.i2sInit', 'init I2S BCK:%1 WS:%2 DATA:%3 rate:%4Hz'),
      inputs: {
        BCK: {
          menu: {
            inputMode: true,
            type: 'integer',
            defaultValue: '26',
            items: ['26', '14', '13'],
          },
        },
        WS: {
          menu: {
            inputMode: true,
            type: 'integer',
            defaultValue: '25',
            items: ['25', '15', '12'],
          },
        },
        DATA: {
          menu: {
            inputMode: true,
            type: 'integer',
            defaultValue: '22',
            items: ['22', '19', '21'],
          },
        },
        RATE: {
          menu: {
            inputMode: true,
            type: 'integer',
            defaultValue: '44100',
            items: ['8000', '16000', '32000', '44100', '48000'],
          },
        },
      },
      mpy(block) {
        const bck = this.valueToCode(block, 'BCK', this.ORDER_NONE);
        const ws = this.valueToCode(block, 'WS', this.ORDER_NONE);
        const data = this.valueToCode(block, 'DATA', this.ORDER_NONE);
        const rate = this.valueToCode(block, 'RATE', this.ORDER_NONE);
        this.definitions_['import_i2s'] = 'from machine import I2S, Pin';
        this.definitions_['i2s'] = `i2s = I2S(0, sck=Pin(${bck}), ws=Pin(${ws}), sd=Pin(${data}), mode=I2S.TX, bits=16, format=I2S.STEREO, rate=${rate}, ibuf=2048)`;
        return '';
      },
    },
    {
      id: 'i2s_play',
      text: translate('esp32.blocks.i2sPlay', 'I2S play %1'),
      inputs: {
        DATA: {
          type: 'string',
          defaultValue: 'audio_data',
        },
      },
      mpy(block) {
        const data = this.valueToCode(block, 'DATA', this.ORDER_NONE);
        return `i2s.write(${data})\n`;
      },
    },
  ],
});
