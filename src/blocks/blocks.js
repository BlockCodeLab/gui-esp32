import getPinsBlocks from './pins';
import getCameraBlocks from './camera';
import getEventsBlocks from './events';
import getControlBlocks from './control';
import getNetworkBlocks from './network';
import getProtocolsBlocks from './protocols';
import getOperatorsBlocks from './operators';
import getDataBlocks from './data';
import getTerminalBlocks from './terminal';
import getSensingBlocks from './sensing';

import { ESP32Boards } from '../lib/boards';
export { ESP32Generator } from './generator';

export function buildBlocks(boardType) {
  const isCamera = [ESP32Boards.ESP32S3_CAM, ESP32Boards.ATOMS3R_CAM].includes(boardType);

  const pinsBlocks = getPinsBlocks(boardType);
  const cameraBlocks = getCameraBlocks(boardType, 1);
  const protocolsBlocks = getProtocolsBlocks(1 + isCamera);
  const eventsBlocks = getEventsBlocks(boardType);
  const controlBlocks = getControlBlocks();
  const networkBlocks = getNetworkBlocks(4 + isCamera);
  const sensingBlocks = getSensingBlocks();
  const operatorsBlocks = getOperatorsBlocks();
  const terminalBlocks = getTerminalBlocks(7 + isCamera);
  const dataBlocks = getDataBlocks();

  return [
    pinsBlocks,
    isCamera && cameraBlocks,
    protocolsBlocks,
    eventsBlocks,
    controlBlocks,
    networkBlocks,
    sensingBlocks,
    operatorsBlocks,
    terminalBlocks,
    dataBlocks,
  ].filter(Boolean);
}
