import './l10n';

import { svgAsDataUri } from '@blockcode/utils';
import { ScratchBlocks, MPYGenerator, blocksTab, codeReviewTab } from '@blockcode/blocks';

import { Text } from '@blockcode/core';
import { BlocksEditor, CodeReview } from '@blockcode/blocks';
import { DeviceIcon } from './components/device-menu/device-icon';
import { DeviceMenu } from './components/device-menu/device-menu';
import { defaultProject } from './lib/default-project';

const mpyGenerator = new MPYGenerator();

const handleExtensionsFilter = () => ['mpy'];

export default {
  onNew() {
    return defaultProject;
  },

  onSave(files, assets) {
    const extensions = [];
    files = files.map((file) => {
      extensions.push(file.extensions);
      return {
        id: file.id,
        type: file.type,
        xml: file.xml,
      };
    });
    const meta = {
      extensions: Array.from(new Set(extensions.flat())),
    };
    return {
      meta,
      files,
      assets,
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
      workspace?.undo?.(false);
    }
  },

  onRedo(e) {
    if (e instanceof MouseEvent) {
      const workspace = ScratchBlocks.getMainWorkspace();
      workspace?.undo?.(true);
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
      label: (
        <Text
          id="mpyblocks.menubar.device"
          defaultMessage="Device"
        />
      ),
      Menu: DeviceMenu,
    },
  ],

  tabs: [
    {
      ...blocksTab,
      Content: () => {
        // 将小绿旗事件修改为程序开始事件
        ScratchBlocks.Blocks['event_whenflagclicked'] = {
          init() {
            this.jsonInit({
              message0: ScratchBlocks.Msg.EVENT_WHENPROGRAMSTART,
              category: ScratchBlocks.Categories.event,
              extensions: ['colours_event', 'shape_hat'],
            });
          },
        };

        return (
          <BlocksEditor
            generator={mpyGenerator}
            onExtensionsFilter={handleExtensionsFilter}
          />
        );
      },
    },
  ].concat(
    DEBUG
      ? {
          ...codeReviewTab,
          Content: CodeReview,
        }
      : [],
  ),
};
