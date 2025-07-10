import { monaco } from '@blockcode/code';

const CompletionItemKind = monaco.languages.CompletionItemKind;

// [TODO] 添加补全类型和使用例
// [INFO] [关键词，类型，使用例]
export const getCompletionItems = () => [
  // 数据类型
  //
  'void',
  'unsignedchar',
  'byte',
  'char',
  'int',
  'word',
  'long',
  'float',
  'string',
  'array',
  'double',

  // 变量与修饰部份
  //
  'volatile',
  'const',

  // 数据运算
  //
  'min',
  'max',
  'abs',
  'constrain',
  'map',
  'pow',
  'sqrt',
  'ceil',
  'exp',
  'fabs',
  'floor',
  'fma',
  'fmax',
  'fmin',
  'fmod',
  'ldexp',
  'log',
  'log10',
  'round',
  'signbit',
  'sq',
  'square',
  'trunc',
  'sin',
  'cos',
  'tan',
  'atan2',
  'cosh',
  'degrees',
  'hypot',
  'radians',
  'sinh',
  'tanh',
  'randomSeed',
  'random',

  // 数字 I/O
  //
  'pinMode',
  'digitalWrite',
  'digitalRead',

  // 模拟 I/O
  //
  'analogReference',
  'analogRead',
  'analogWrite',

  // 高级I/O
  //
  'tone',
  'noTone',
  'shifOut',
  'shiftln',
  'pulseln',

  // 时间
  //
  'delay',
  'millis',
  'micros',
  'lowByte',
  'highBye',
  'bitRead',
  'bitWrite',
  'bitSet',
  'bitClear',
  'bit',
  'attachlnterrupt',
  'detachlnterrupt',
  'interrupts',
  'nolnterrupts',

  // 通讯
  //
  'Serial',
  'available',
  'begin',
  'end',
  'find',
  'findUntil',
  'flush',
  'parseFloat',
  'parselnt',
  'read',
  'readBytes',
  'readBytesUntil',
  'setTimeout',
  'write',
  'SerialEvent',
  'Stream',
  'Mouse',
  'Keyboard',

  // 其他
  //
  'include',
];
