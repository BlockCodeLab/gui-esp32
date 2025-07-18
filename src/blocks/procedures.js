import { ScratchBlocks } from '@blockcode/blocks';

const ARGUMENT_TYPES = {
  argument_reporter_string_number: 'String',
  argument_reporter_boolean: 'bool',
  argument_reporter_number: 'float',
};

const PROCEDURES_CALL_TYPE_STATEMENT = 0;
const PROCEDURES_CALL_TYPE_BOOLEAN = 1;
const PROCEDURES_CALL_TYPE_REPORTER = 2;
const PROCEDURES_CALL_TYPE_REPORTER_STRING = 3;
const RETURN_TYPES = {
  [PROCEDURES_CALL_TYPE_STATEMENT]: 'void',
  [PROCEDURES_CALL_TYPE_BOOLEAN]: 'bool',
  [PROCEDURES_CALL_TYPE_REPORTER]: 'float',
  [PROCEDURES_CALL_TYPE_REPORTER_STRING]: 'String',
};

export default () => ({
  id: 'procedures',
  skipXML: true,
  blocks: [
    {
      id: 'definition',
      mpy(block) {
        const myBlock = block.childBlocks_[0];
        const funcName = this.getFunctionName(myBlock.getProcCode());
        const branchCode = this.statementToCode(block);

        // 参数格式：name
        const args = myBlock.childBlocks_.map((argBlock) => `${this.getVariableName(argBlock.getFieldValue('VALUE'))}`);

        // 定义函数
        let code = '';
        code += `def ${funcName}(${args.join(', ')}):
`;
        code += branchCode
          .split('\n')
          .map((line) => `  ${line}`)
          .join('\n');
        this.definitions_[funcName] = code;
      },
    },
    {
      id: 'call',
      mpy(block) {
        const funcName = this.getFunctionName(block.getProcCode());
        const args = block.argumentIds_.map((arg) => this.valueToCode(block, arg, this.ORDER_NONE) || 'False');
        const code = `${funcName}(${args.join(', ')})`;

        if (block.return_) {
          return [code, this.ORDER_FUNCTION_CALL];
        }
        return code + '\n';
      },
    },
    {
      id: 'return',
      mpy(block) {
        const valueCode = this.valueToCode(block, 'VALUE', this.ORDER_NONE);
        const code = `return ${valueCode}\n`;
        return code;
      },
    },
    {
      id: 'return_string',
      mpy(block) {
        const valueCode = this.valueToCode(block, 'STR', this.ORDER_NONE);
        const code = `return str(${valueCode})\n`;
        return code;
      },
    },
  ],
});
