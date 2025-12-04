import getPinsBlocks from './pins';
import getSerialBlocks from './serial';
import getEventsBlocks from './events';
import getControlBlocks from './control';
import getNetworkBlocks from './network';
import getProtocolsBlocks from './protocols';
import getOperatorsBlocks from './operators';
import getDataBlocks from './data';
import getTerminalBlocks from './terminal';
import getSensingBlocks from './sensing';

export { ESP32Generator } from './generator';

export function buildBlocks(boardType) {
  const pinsBlocks = getPinsBlocks(boardType);
  const serialBlocks = getSerialBlocks();
  const eventsBlocks = getEventsBlocks(boardType);
  const controlBlocks = getControlBlocks();
  const networkBlocks = getNetworkBlocks();
  const protocolsBlocks = getProtocolsBlocks();
  const operatorsBlocks = getOperatorsBlocks();
  const dataBlocks = getDataBlocks();
  const terminalBlocks = getTerminalBlocks();
  const sensingBlocks = getSensingBlocks();

  return [
    pinsBlocks,
    serialBlocks,
    protocolsBlocks,
    eventsBlocks,
    controlBlocks,
    networkBlocks,
    sensingBlocks,
    terminalBlocks,
    operatorsBlocks,
    dataBlocks,
  ];
}
