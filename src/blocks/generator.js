import { MicroPythonGenerator } from '@blockcode/blocks';

const GENERATOR_COMMENT = '# Generate by BlockCode\n';

export class ESP32Generator extends MicroPythonGenerator {
  constructor() {
    super('ESP32');
  }

  finish(code) {
    return GENERATOR_COMMENT + super.finish(code);
  }
}
