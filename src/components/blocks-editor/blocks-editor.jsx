import { useEffect, useCallback } from 'preact/hooks';
import { useSignal } from '@preact/signals';
import { useAppContext, useProjectContext, setAppState } from '@blockcode/core';
import { BlocksEditor } from '@blockcode/blocks';
import { CodeEditor } from '@blockcode/code';
import { ESP32Generator, buildBlocks, VARIABLE_TYPES } from '../../blocks/blocks';

import showIcon from './icon-show.svg';
import hideIcon from './icon-hide.svg';
import styles from './blocks-editor.module.css';

const generator = new ESP32Generator();

const handleExtensionsFilter = () => ['esp32'];

export function ESP32BlocksEditor() {
  const { appState, tabIndex } = useAppContext();

  const { meta } = useProjectContext();

  const toolboxStyles = useSignal(null);

  const handleBuildinExtensions = useCallback(() => {
    return buildBlocks(meta.value.boardType, meta.value.classicEvents);
  }, [meta.value.boardType, meta.value.classicEvents]);

  const handleResize = useCallback(() => {
    const toolbox = document.querySelector('.blocklyZoom');
    if (toolbox) {
      const transform = toolbox.getAttribute('transform');
      toolboxStyles.value = {
        transform: transform.replace(/(\d+)/g, '$1px'),
      };
    }
  }, []);

  const handleCodePreview = useCallback(() => {
    const hiddenCodePreview = !appState.value?.hiddenCodePreview;
    setAppState({ hiddenCodePreview });
  }, []);

  return (
    <div className={styles.editorWrapper}>
      <BlocksEditor
        enableProcedureReturns
        disableSensingBlocks
        disableGenerateCode={tabIndex.value !== 0}
        variableTypes={VARIABLE_TYPES}
        generator={generator}
        onBuildinExtensions={handleBuildinExtensions}
        onExtensionsFilter={handleExtensionsFilter}
        onResize={handleResize}
      />

      <div
        className={styles.toolboxWrapper}
        style={toolboxStyles.value}
      >
        <img
          width={36}
          height={36}
          src={appState.value?.hiddenCodePreview ? hideIcon : showIcon}
          onClick={handleCodePreview}
        />
      </div>

      {!appState.value?.hiddenCodePreview && (
        <CodeEditor
          readOnly
          className={styles.codeEditor}
          options={{ fontSize: 13 }}
        />
      )}
    </div>
  );
}