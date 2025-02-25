import { nanoid } from '@blockcode/utils';

const codeId = nanoid();

const DEFAULT_MAIN_CONTENT = `
from blocks import *
import ${codeId}
start()
`;

export const defaultProject = {
  assets: [
    {
      id: 'main',
      type: 'text/x-python',
      content: DEFAULT_MAIN_CONTENT,
    },
  ],
  files: [
    {
      id: codeId,
      type: 'text/x-python',
    },
  ],
};
