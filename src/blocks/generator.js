import { PythonGenerator } from '@blockcode/blocks';

const GENERATOR_COMMENT = '# Generate by BlockCode\n';

export class ESP32Generator extends PythonGenerator {
  constructor() {
    super('ESP32');
  }

  init(workspace) {
    super.init(workspace);
  }
}
