import { useCallback } from 'preact/hooks';
import { useAppContext, useProjectContext } from '@blockcode/core';
import { BlocksEditor } from '@blockcode/blocks';
import { ESP32Generator, buildBlocks } from '../../blocks/blocks';

const generator = new ESP32Generator();

const handleExtensionsFilter = () => ['esp32'];

export function ESP32BlocksEditor() {
  const { tabIndex } = useAppContext();

  const { meta } = useProjectContext();

  const handleBuildinExtensions = useCallback(() => {
    return buildBlocks(meta.value.boardType, meta.value.classicEvents);
  }, [meta.value.boardType, meta.value.classicEvents]);

  return (
    <BlocksEditor
      enableCodePreview
      enableProcedureReturns
      disableSensingBlocks
      disableGenerateCode={tabIndex.value !== 0}
      generator={generator}
      onBuildinExtensions={handleBuildinExtensions}
      onExtensionsFilter={handleExtensionsFilter}
    />
  );
}
