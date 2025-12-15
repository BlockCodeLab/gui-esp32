import './l10n';

import { svgAsDataUri } from '@blockcode/utils';
import { ScratchBlocks, blocksTab, codeReviewTab } from '@blockcode/blocks';
import { terminalTab } from '@blockcode/code';

import { ESP32BlocksEditor } from './components/blocks-editor/blocks-editor';
import { DeviceIcon } from './components/device-menu/device-icon';
import { DeviceLabel } from './components/device-menu/device-label';
import { DeviceMenu } from './components/device-menu/device-menu';
import { defaultProject } from './lib/default-project';
import { ESP32Boards } from './lib/boards';

export default {
  onNew() {
    return defaultProject;
  },

  onSave(files, assets, meta) {
    return {
      files,
      assets,
      meta: {
        boardType: meta.boardType ?? ESP32Boards.ESP32,
      },
    };
  },

  async onThumb() {
    const workspace = ScratchBlocks.getMainWorkspace();
    if (workspace) {
      const canvas = workspace.getCanvas();
      if (canvas) {
        return await svgAsDataUri(canvas, {});
      }
    }
  },

  onUndo(e) {
    if (e instanceof MouseEvent) {
      const workspace = ScratchBlocks.getMainWorkspace();
      workspace?.undo(false);
    }
  },

  onRedo(e) {
    if (e instanceof MouseEvent) {
      const workspace = ScratchBlocks.getMainWorkspace();
      workspace?.undo(true);
    }
  },

  onEnableUndo() {
    const workspace = ScratchBlocks.getMainWorkspace();
    return workspace?.undoStack_ && workspace.undoStack_.length !== 0;
  },

  onEnableRedo() {
    const workspace = ScratchBlocks.getMainWorkspace();
    return workspace?.redoStack_ && workspace.redoStack_.length !== 0;
  },

  menuItems: [
    {
      icon: <DeviceIcon />,
      label: <DeviceLabel />,
      Menu: DeviceMenu,
    },
  ],

  tabs: [
    {
      ...blocksTab,
      Content: ESP32BlocksEditor,
    },
    {
      ...codeReviewTab,
    },
    {
      ...terminalTab,
    },
  ],
};
