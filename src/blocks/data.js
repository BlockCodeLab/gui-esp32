export default () => ({
  id: 'data',
  skipXML: true,
  blocks: [
    {
      // 声明变量
      id: 'setvariableto',
      mpy(block) {
        const varName = this.getVariableName(block.getFieldValue('VARIABLE'));
        const varValue = this.valueToCode(block, 'VALUE', this.ORDER_NONE);
        const code = `${varName} = ${varValue}`;

        // 全局变量
        const rootBlock = block.getRootBlock();
        if (rootBlock.type === 'event_whensetup') {
          this.definitions_[`variable_${varName}`] = code;
          return '';
        }
        // 私有变量
        return code + '\n';
      },
    },
    {
      // 设置变量
      id: 'changevariableby',
      mpy(block) {
        const varName = this.getVariableName(block.getFieldValue('VARIABLE'));
        const varValue = this.valueToCode(block, 'VALUE', this.ORDER_NONE);
        return `${varName} = ${varValue}\n`;
      },
    },
    {
      // 获取变量
      id: 'variable',
      mpy(block) {
        const varName = this.getVariableName(block.getFieldValue('VARIABLE'));
        return [varName, this.ORDER_ATOMIC];
      },
    },
    {
      // 声明数组
      id: 'insertatlist',
      mpy(block) {
        const arrName = 'arr' + this.getVariableName(block.getFieldValue('LIST'));
        const arrSize = this.valueToCode(block, 'INDEX', this.ORDER_NONE);
        const code = `${arrName} = [None] * int(${arrSize})`;

        // 全局变量
        const rootBlock = block.getRootBlock();
        if (rootBlock.type === 'event_whensetup') {
          this.definitions_[`variable_${arrName}`] = code;
          return '';
        }
        // 私有变量
        return code + '\n';
      },
    },
    {
      // 设置数组项
      id: 'replaceitemoflist',
      mpy(block) {
        const arrName = 'arr' + this.getVariableName(block.getFieldValue('LIST'));
        const arrValue = this.valueToCode(block, 'ITEM', this.ORDER_NONE);
        const index = this.valueToCode(block, 'INDEX', this.ORDER_NONE);
        return `${arrName}[int(${index})] = ${arrValue}\n`;
      },
    },
    {
      // 获取数组
      id: 'listcontents',
      mpy(block) {
        const arrName = 'arr' + this.getVariableName(block.getFieldValue('LIST'));
        return [arrName, this.ORDER_ATOMIC];
      },
    },
    {
      // 获取数组项
      id: 'itemoflist',
      mpy(block) {
        const arrName = 'arr' + this.getVariableName(block.getFieldValue('LIST'));
        const index = this.valueToCode(block, 'INDEX', this.ORDER_NONE);
        const code = `${arrName}[int(${index})]`;
        return [code, this.ORDER_MEMBER];
      },
    },
    {
      // 数组长度
      id: 'lengthoflist',
      mpy(block) {
        const arrName = 'arr' + this.getVariableName(block.getFieldValue('LIST'));
        const code = `len(${arrName})`;
        return [code, this.ORDER_FUNCTION_CALL];
      },
    },
  ],
});
