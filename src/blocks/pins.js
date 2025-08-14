import { translate, themeColors } from '@blockcode/core';
import { ESP32Boards } from '../lib/boards';

export default (boardType) => {
  let ioPins = boardType === ESP32Boards.ESP32S3 ? 'ESP32S3_PINS' : 'ESP32_PINS';
  let adcPins = boardType === ESP32Boards.ESP32S3 ? 'ESP32S3_ADC_PINS' : 'ESP32_ADC_PINS';

  return {
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
            menu: ioPins,
          },
          MODE: {
            menu: [
              [translate('esp32.blocks.ouputMode', 'output'), 'OUTPUT'],
              [translate('esp32.blocks.inputMode', 'input'), 'INPUT'],
              [translate('esp32.blocks.inputPullUpMode', 'input pull-up'), 'INPUT_PULLUP'],
              [translate('esp32.blocks.inputPullDownMode', 'input pull-down'), 'INPUT_PULLDOWN'],
            ],
          },
        },
        mpy(block) {
          const pin = block.getFieldValue('PIN') || 0;
          const pinName = `pin_${pin}`;
          const mode = block.getFieldValue('MODE') || 'OUTPUT';
          this.definitions_['import_pin'] = 'from machine import Pin';

          let code = '';
          if (mode === 'INPUT') {
            code = `${pinName} = Pin(${pin}, Pin.IN)`;
          } else if (mode === 'INPUT_PULLUP') {
            code = `${pinName} = Pin(${pin}, Pin.IN, Pin.PULL_UP)`;
          } else if (mode === 'INPUT_PULLDOWN') {
            code = `${pinName} = Pin(${pin}, Pin.IN, Pin.PULL_DOWN)`;
          } else {
            code = `${pinName} = Pin(${pin}, Pin.OUT)`;
          }
          this.definitions_[pinName] = code;

          return '';
        },
      },
      '---',
      {
        // 数字引脚设为
        id: 'setdigital',
        text: translate('esp32.blocks.setdigital', 'set digital pin %1 to %2'),
        inputs: {
          PIN: {
            menu: ioPins,
          },
          VALUE: {
            inputMode: true,
            type: 'integer',
            defaultValue: '1',
            menu: [
              [translate('esp32.blocks.digitalHigh', 'high'), '1'],
              [translate('esp32.blocks.digitalLow', 'low'), '0'],
            ],
          },
        },
        mpy(block) {
          const pin = block.getFieldValue('PIN') || 0;
          const pinName = `pin_${pin}`;
          const value = this.valueToCode(block, 'VALUE', this.ORDER_NONE);
          this.definitions_['import_pin'] = 'from machine import Pin';
          this.definitions_[pinName] = this.definitions_[pinName] ?? `${pinName} = Pin(${pin}, Pin.OUT)`;
          const code = `${pinName}.value(${value})\n`;
          return code;
        },
      },
      ...(boardType === ESP32Boards.ESP32_IOT_BOARD || boardType === ESP32Boards.ESP32
        ? [
            {
              // 模拟 引脚设为
              id: 'setDAC',
              text: translate('esp32.blocks.setanalog', 'set analog pin %1 to %2'),
              inputs: {
                PIN: {
                  menu: 'ESP32_DAC_PINS',
                },
                VALUE: {
                  shadow: 'slider255',
                },
              },
              mpy(block) {
                const pin = block.getFieldValue('PIN') || 0;
                const value = this.valueToCode(block, 'VALUE', this.ORDER_NONE);
                this.definitions_['import_pin'] = 'from machine import Pin';
                this.definitions_['import_dac'] = 'from machine import DAC';
                this.definitions_[`dac_${pin}`] = `dac_${pin} = DAC(Pin(${pin}))`;
                const code = `dac_${pin}.write(${value})\n`;
                return code;
              },
            },
            {
              // 0-255 滑块
              id: 'slider255',
              inline: true,
              output: 'integer',
              inputs: {
                VALUE: {
                  type: 'slider',
                  min: 0,
                  max: 255,
                  step: 1,
                  defaultValue: 128,
                },
              },
              mpy(block) {
                const value = block.getFieldValue('VALUE') || 0;
                return [value, this.ORDER_ATOMIC];
              },
            },
          ]
        : []),
      {
        // 数字引脚是否为高电平？
        id: 'digital',
        text: translate('esp32.blocks.isDigitalHigh', 'digital pin %1 is high?'),
        output: 'boolean',
        inputs: {
          PIN: {
            menu: ioPins,
          },
        },
        mpy(block) {
          const pin = block.getFieldValue('PIN') || 0;
          const pinName = `pin_${pin}`;
          this.definitions_['import_pin'] = 'from machine import Pin';
          this.definitions_[pinName] = `${pinName} = Pin(${pin}, Pin.IN)`;
          return [`(${pinName}.value() == 1)`, this.ORDER_RELATIONAL];
        },
      },
      {
        // 模拟引脚值
        id: 'analog',
        text: translate('esp32.blocks.analogValue', 'analog pin %1 value'),
        output: 'integer',
        inputs: {
          PIN: {
            menu: adcPins,
          },
        },
        mpy(block) {
          const pin = block.getFieldValue('PIN') || 0;
          this.definitions_['import_adc'] = 'from machine import ADC';
          this.definitions_[`adc_${pin}`] = `adc_${pin} = ADC(Pin(${pin}))`;
          return [`adc_${pin}.read()`, this.ORD_FUNCTION_CALL];
        },
      },
      '---',
      {
        // PWM 引脚频率设为
        id: 'setPWMFreq',
        text: translate('esp32.blocks.setpwmfreq', 'set pwm pin %1 frequency to %2 Hz'),
        inputs: {
          PIN: {
            menu: ioPins,
          },
          FREQ: {
            type: 'integer',
            defaultValue: '1000',
          },
        },
        mpy(block) {
          const pin = block.getFieldValue('PIN') || 0;
          const freq = this.valueToCode(block, 'FREQ', this.ORDER_NONE);
          this.definitions_['import_pin'] = 'from machine import Pin';
          this.definitions_['import_pwm'] = 'from machine import PWM';
          this.definitions_[`pwm_${pin}`] = `pwm_${pin} = PWM(Pin(${pin}), freq=1000)`;
          const code = `pwm_${pin}.freq(${freq})\n`;
          return code;
        },
      },
      {
        // PWM 引脚设为
        id: 'setPWM',
        text: translate('esp32.blocks.setpwm', 'set pwm pin %1 to %2'),
        inputs: {
          PIN: {
            menu: ioPins,
          },
          VALUE: {
            shadow: 'slider1023',
          },
        },
        mpy(block) {
          const pin = block.getFieldValue('PIN') || 0;
          const value = this.valueToCode(block, 'VALUE', this.ORDER_NONE);
          this.definitions_['import_pin'] = 'from machine import Pin';
          this.definitions_['import_pwm'] = 'from machine import PWM';
          this.definitions_[`pwm_${pin}`] = `pwm_${pin} = PWM(Pin(${pin}), freq=1000)`;
          const code = `pwm_${pin}.duty_u16(${value} * 64)\n`;
          return code;
        },
      },
      {
        // 0-1023 滑块
        id: 'slider1023',
        inline: true,
        output: 'integer',
        inputs: {
          VALUE: {
            type: 'slider',
            min: 0,
            max: 1023,
            step: 1,
            defaultValue: 512,
          },
        },
        mpy(block) {
          const value = block.getFieldValue('VALUE') || 0;
          return [value, this.ORDER_ATOMIC];
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
            menu: ioPins,
          },
          INTERRUPT: {
            menu: [
              [translate('esp32.blocks.interruptRising', 'rising'), 'RISING'],
              [translate('esp32.blocks.interruptFalling', 'falling'), 'FALLING'],
              [translate('esp32.blocks.interruptChange', 'change'), 'CHANGE'],
              [translate('esp32.blocks.interruptHigh', 'high'), 'HIGH'],
              [translate('esp32.blocks.interruptLow', 'low'), 'LOW'],
            ],
          },
        },
        mpy(block) {
          const pin = block.getFieldValue('PIN') || 0;
          const pinName = `pin_${pin}`;
          const flagName = `interrupt_${pin}_flag`;
          const interrupt = block.getFieldValue('INTERRUPT') || 'RISING';
          this.definitions_['import_pin'] = 'from machine import Pin';
          this.definitions_[pinName] = this.definitions_[pinName] ?? `${pinName} = Pin(${pin}, Pin.IN)`;
          this.definitions_[flagName] = `${flagName} = asyncio.ThreadSafeFlag()`;

          // 定义中断回调函数
          let branchCode = this.statementToCode(block, 'SUBSTACK') || this.PASS;
          let code = '';
          code += 'while True:\n';
          code += `${this.INDENT}await ${flagName}.wait()\n`;
          code += branchCode;

          branchCode = this.prefixLines(code, this.INDENT);
          branchCode = this.addEventTrap(branchCode, block.id);
          code = '@_tasks__.append\n';
          code += branchCode;
          this.definitions_[`interrupt_${pin}`] = code;

          const triggerMap = {
            RISING: 'Pin.IRQ_RISING',
            FALLING: 'Pin.IRQ_FALLING',
            CHANGE: 'Pin.IRQ_RISING | Pin.IRQ_FALLING',
            HIGH: 'Pin.IRQ_HIGH_LEVEL',
            LOW: 'Pin.IRQ_LOW_LEVEL',
          };
          const trigger = triggerMap[interrupt] || 'Pin.IRQ_RISING';
          return `${pinName}.irq(trigger=${trigger}, handler=lambda _: ${flagName}.set())\n`;
        },
      },
      {
        // 解除中断
        id: 'detachinterrupt',
        text: translate('esp32.blocks.detachinterrupt', 'detach pin %1 interrupt'),
        inputs: {
          PIN: {
            menu: ioPins,
          },
        },
        mpy(block) {
          const pin = block.getFieldValue('PIN') || 0;
          return `pin_${pin}.irq(handler=None)\n`;
        },
      },
    ],
    menus: {
      ESP32_PINS: {
        items: [
          ['0', '0'],
          ['1', '1'],
          ['2', '2'],
          ['3', '3'],
          ['4', '4'],
          ['5', '5'],
          ['6', '6'],
          ['7', '7'],
          ['8', '8'],
          ['9', '9'],
          ['10', '10'],
          ['11', '11'],
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
      ESP32S3_PINS: {
        items: [
          ['0', '0'],
          ['1', '1'],
          ['2', '2'],
          ['3', '3'],
          ['4', '4'],
          ['5', '5'],
          ['6', '6'],
          ['7', '7'],
          ['8', '8'],
          ['9', '9'],
          ['10', '10'],
          ['11', '11'],
          ['12', '12'],
          ['13', '13'],
          ['14', '14'],
          ['15', '15'],
          ['16', '16'],
          ['17', '17'],
          ['18', '18'],
          ['19', '19'],
          ['20', '20'],
          ['21', '21'],
          ['35', '35'],
          ['36', '36'],
          ['37', '37'],
          ['38', '38'],
          ['39', '39'],
          ['40', '40'],
          ['41', '41'],
          ['42', '42'],
          ['43', '43'],
          ['44', '44'],
          ['45', '45'],
          ['46', '46'],
          ['47', '47'],
          ['48', '48'],
        ],
      },
      ESP32_ADC_PINS: {
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
          ['37', '37'],
          ['38', '38'],
          ['39', '39'],
        ],
      },
      ESP32S3_ADC_PINS: {
        items: [
          ['1', '1'],
          ['2', '2'],
          ['3', '3'],
          ['4', '4'],
          ['5', '5'],
          ['6', '6'],
          ['7', '7'],
          ['8', '8'],
          ['9', '9'],
          ['10', '10'],
          ['11', '11'],
          ['12', '12'],
          ['13', '13'],
          ['14', '14'],
          ['15', '15'],
          ['16', '16'],
          ['17', '17'],
          ['18', '18'],
          ['19', '19'],
          ['20', '20'],
        ],
      },
      ESP32_DAC_PINS: {
        items: [
          ['17', '17'],
          ['18', '18'],
        ],
      },
    },
  };
};
