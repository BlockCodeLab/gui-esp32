import { translate, themeColors } from '@blockcode/core';
import { ESP32Boards } from '../lib/boards';

export default (boardType) => ({
  id: 'pin',
  name: translate('esp32.blocks.pin', 'Pins'),
  themeColor: themeColors.blocks.motion.primary,
  inputColor: themeColors.blocks.motion.secondary,
  otherColor: themeColors.blocks.motion.tertiary,
  order: 0,
  blocks: [
    {
      // 设置模式
      id: 'setmode',
      text: translate('esp32.blocks.setmode', 'set pin %1 mode to %2'),
      inputs: {
        PIN: {
          menu: 'ESP32_PINS',
        },
        MODE: {
          menu: [
            [translate('esp32.blocks.inputMode', 'input'), 'INPUT'],
            [translate('esp32.blocks.ouputMode', 'output'), 'OUTPUT'],
            [translate('esp32.blocks.inputPullUpMode', 'input pull-up'), 'INPUT_PULLUP'],
            [translate('esp32.blocks.inputPullDownMode', 'input pull-down'), 'INPUT_PULLDOWN'],
          ],
        },
      },
      esp32(block) {
        this.definitions_['pin'] = 'from machine import Pin';
        const pin = block.getFieldValue('PIN') || 0;
        const mode = block.getFieldValue('MODE') || 'INPUT';
        let code = '';
        if (mode === 'INPUT') {
          code = `pin_${pin} = Pin(${pin}, Pin.IN)\n`;
        } else if (mode === 'OUTPUT') {
          code = `pin_${pin} = Pin(${pin}, Pin.OUT)\n`;
        } else if (mode === 'INPUT_PULLUP') {
          code = `pin_${pin} = Pin(${pin}, Pin.INPUT, Pin.PULL_UP)\n`;
        } else if (mode === 'INPUT_PULLDOWN') {
          code = `pin_${pin} = Pin(${pin}, Pin.INPUT, Pin.PULL_DOWN)\n`;
        }
        return code;
      },
    },
    '---',
    {
      // 数字引脚设为
      id: 'setdigital',
      text: translate('esp32.blocks.setdigital', 'set digital pin %1 to %2'),
      inputs: {
        PIN: {
          menu: 'ESP32_DIGITAL_PINS',
        },
        VALUE: {
          inputMode: true,
          type: 'number',
          defaultValue: '1',
          menu: [
            [translate('esp32.blocks.digitalHigh', 'high'), '1'],
            [translate('esp32.blocks.digitalLow', 'low'), '0'],
          ],
        },
      },
      esp32(block) {
        const pin = block.getFieldValue('PIN') || 0;
        const value = this.valueToCode(block, 'VALUE', this.ORDER_NONE);
        const code = `pin_${pin}.value(${value})\n`;
        return code;
      },
    },
    {
      // 模拟/PWM 引脚设为
      id: 'setPWM',
      text: translate('esp32.blocks.setanalog', 'set pwm pin %1 to %2'),
      inputs: {
        PIN: {
          menu: 'ESP32_PWM_PINS',
        },
        VALUE: {
          shadow: 'slider255',
        },
      },
      esp32(block) {
        const pin = block.getFieldValue('PIN') || 0;
        const value = this.valueToCode(block, 'VALUE', this.ORDER_NONE);
        this.definitions_['pwm'] = 'from machine import Pin, PWM';
        let code = `pwm_${pin} = PWM(Pin(${pin}), freq=500)\n`;
        code += `pwm_${pin}.duty_u16(${value} * 257)\n`;
        return code;
      },
    },
    {
      // 0-255 滑块
      id: 'slider255',
      inline: true,
      output: 'number',
      inputs: {
        VALUE: {
          type: 'slider',
          min: 0,
          max: 255,
          step: 1,
          defaultValue: 127,
        },
      },
      esp32(block) {
        const value = block.getFieldValue('VALUE') || 0;
        return [value, this.ORDER_ATOMIC];
      },
    },
    {
      // 数字引脚是否为高电平？
      id: 'digital',
      text: translate('esp32.blocks.isDigitalHigh', 'digital pin %1 is high?'),
      output: 'boolean',
      inputs: {
        PIN: {
          menu: 'ESP32_DIGITAL_PINS',
        },
      },
      esp32(block) {
        this.definitions_['pin'] = 'from machine import Pin';
        const pin = block.getFieldValue('PIN') || 0;
        return `pin_${pin}.value() == 1`;
      },
    },
    {
      // 模拟引脚值
      id: 'analog',
      text: translate('esp32.blocks.analogValue', 'analog pin %1'),
      output: 'number',
      inputs: {
        PIN: {
          menu: 'ESP32_ANALOG_PINS',
        },
      },
      esp32(block) {
        this.definitions_['adc'] = 'from machine import ADC';
        const pin = block.getFieldValue('PIN') || 0;
        return `ADC(Pin(${pin})).read()\n`;
      },
    },
    '---',
    {
      // 设置中断
      id: 'attachinterrupt',
      text: translate('esp32.blocks.attachinterrupt', 'attach pin %1 interrupt to %2'),
      substack: true,
      inputs: {
        PIN: {
          menu: 'ESP32_DIGITAL_PINS',
        },
        INTERRUPT: {
          menu: [
            [translate('esp32.blocks.interruptRising', 'rising'), 'RISING'],
            [translate('esp32.blocks.interruptFalling', 'falling'), 'FALLING'],
            [translate('esp32.blocks.interruptChange', 'change'), 'CHANGE'],
            //[translate('esp32.blocks.interruptHigh', 'high'), 'HIGH'],
            [translate('esp32.blocks.interruptLow', 'low'), 'LOW'],
          ],
        },
      },
      esp32(block) {
        this.definitions_['pin'] = 'from machine import Pin';
        const pin = block.getFieldValue('PIN') || 0;
        const interrupt = block.getFieldValue('INTERRUPT') || 'RISING';
        const funcName = `interrupt_${pin}_${interrupt}`;

        // 定义中断回调函数
        const branchCode = this.statementToCode(block, 'SUBSTACK') || '';
        this.definitions_[funcName] = `def ${funcName}():\n${branchCode.split('\n').map(line => `  ${line}`).join('\n')}`;

        const triggerMap = {
          'RISING': 'Pin.IRQ_RISING',
          'FALLING': 'Pin.IRQ_FALLING',
          'CHANGE': 'Pin.IRQ_RISING | Pin.IRQ_FALLING',
          'LOW': 'Pin.IRQ_LOW_LEVEL'
        };
        const trigger = triggerMap[interrupt] || 'Pin.IRQ_RISING';
        return `pin_${pin}.irq(trigger=${trigger}, handler=${funcName})\n`;
      },
    },
    {
      // 解除中断
      id: 'detachinterrupt',
      text: translate('esp32.blocks.detachinterrupt', 'detach pin %1 interrupt'),
      inputs: {
        PIN: {
          menu: 'ESP32_DIGITAL_PINS',
        },
      },
      esp32(block) {
        const pin = block.getFieldValue('PIN') || 0;
        return `pin_${pin}.irq(handler=None)\n`;
      },
    },
  ],
  menus: {
    ESP32_PINS: {
      // Arduino Uno R3/R4 所有引脚
      items: [
        ['0', '0'],
        ['1', '1'],
        ['2', '2'],
        ['3', '3'],
        ['4', '4'],
        ['5', '5'],
        ['12', '12'],
        ['13', '13'],
        ['14', '14'],
        ['15', '15'],
        ['16', '16'],
        ['17', '17'],
        ['18', '18'],
        ['19', '19'],
        ['21', '21'],
        ['22', '22'],
        ['23', '23'],
        ['25', '25'],
        ['26', '26'],
        ['27', '27'],
        ['32', '32'],
        ['33', '33'],
        ['34', '34'],
        ['35', '35'],
        ['36', '36'],
        ['39', '39'],
      ],
    },

    ESP32_DIGITAL_PINS: {
      // Arduino Uno R3/R4 所有引脚
      items: [
        ['0', '0'],
        ['1', '1'],
        ['2', '2'],
        ['3', '3'],
        ['4', '4'],
        ['5', '5'],
        ['12', '12'],
        ['13', '13'],
        ['14', '14'],
        ['15', '15'],
        ['16', '16'],
        ['17', '17'],
        ['18', '18'],
        ['19', '19'],
        ['21', '21'],
        ['22', '22'],
        ['23', '23'],
        ['25', '25'],
        ['26', '26'],
        ['27', '27'],
        ['32', '32'],
        ['33', '33'],
      ],
    },
    ESP32_ANALOG_PINS: {
      // Arduino UNO 模拟读引脚
      items: [
        ['0', '0'],
        ['2', '2'],
        ['4', '4'],
        ['12', '12'],
        ['13', '13'],
        ['14', '14'],
        ['15', '15'],
        ['25', '25'],
        ['26', '26'],
        ['27', '27'],
        ['32', '32'],
        ['33', '33'],
        ['34', '34'],
        ['35', '35'],
        ['36', '36'],
        ['39', '39'],
      ],
    },

    ESP32_PWM_PINS: {
      // Arduino UNO/Nano PWM 写引脚
      items: [
        ['0', '0'],
        ['1', '1'],
        ['2', '2'],
        ['3', '3'],
        ['4', '4'],
        ['5', '5'],
        ['12', '12'],
        ['13', '13'],
        ['14', '14'],
        ['15', '15'],
        ['16', '16'],
        ['17', '17'],
        ['18', '18'],
        ['19', '19'],
        ['21', '21'],
        ['22', '22'],
        ['23', '23'],
        ['25', '25'],
        ['26', '26'],
        ['27', '27'],
        ['32', '32'],
        ['33', '33'],
      ],
    },

     ESP32_DAC_PINS: {
      // Arduino UNO/Nano PWM 写引脚
      items: [
        ['25', '25'],
        ['26', '26'],
      ],
    },
  },
});
