import { useCallback } from 'preact/hooks';
import { useAppContext, useProjectContext } from '@blockcode/core';
import { MicroPythonGenerator, BlocksEditor } from '@blockcode/blocks';
import { ESP32Generator, buildBlocks } from '../../blocks/blocks';
import { extensionTags } from './extension-tags';

// 过滤字符
const escape = (name) => name.replaceAll(/[^a-z0-9]/gi, '_').replace(/^_/, '');

const generator = new ESP32Generator();

const handleExtensionsFilter = () => [['device', '!scratch'], 'data'];

export function ESP32BlocksEditor() {
  const { tabIndex } = useAppContext();

  const { meta } = useProjectContext();

  const handleBuildinExtensions = useCallback(() => {
    return buildBlocks(meta.value.boardType, meta.value.classicEvents);
  }, [meta.value.boardType, meta.value.classicEvents]);

  const handleDefinitions = useCallback((name, define, resources, index) => {
    // 保留原有的定义
    MicroPythonGenerator.prototype.onDefinitions.call(generator);
    // 导入使用的扩展
    for (const id in resources) {
      for (const extModule of resources[id]) {
        if (!extModule.common) {
          define(`import_${id}_${extModule.name}`, `from ${escape(id)} import ${extModule.name}`);
        }
      }
    }
  }, []);

  return (
    <BlocksEditor
      enableCodePreview
      enableProcedureReturns
      disableSensingBlocks
      disableGenerateCode={tabIndex.value !== 0}
      extensionTags={extensionTags}
      generator={generator}
      onBuildinExtensions={handleBuildinExtensions}
      onDefinitions={handleDefinitions}
      onExtensionsFilter={handleExtensionsFilter}
    />
  );
}
