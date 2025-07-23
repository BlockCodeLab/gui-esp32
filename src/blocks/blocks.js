import getPinsBlocks from './pins';
import getTextBlocks from './text';
import getSerialBlocks from './serial';
import getEventsBlocks from './events';
import getControlBlocks from './control';
import getNetworkBlocks from './network';
import getProtocolsBlocks from './protocols';
import getOperatorsBlocks from './operators';
import getDataBlocks from './data';
import getMyBlocks from './procedures';

export { ESP32Generator } from './generator';

export function buildBlocks(boardType) {
  const pinsBlocks = getPinsBlocks(boardType);
  const textBlocks = getTextBlocks();
  const serialBlocks = getSerialBlocks();
  const eventsBlocks = getEventsBlocks(boardType);
  const controlBlocks = getControlBlocks();
  const networkBlocks = getNetworkBlocks();
  const protocolsBlocks = getProtocolsBlocks();
  const operatorsBlocks = getOperatorsBlocks();
  const dataBlocks = getDataBlocks();
  const myBlocks = getMyBlocks();

  return [
    pinsBlocks,
    textBlocks,
    serialBlocks,
    eventsBlocks,
    controlBlocks,
    networkBlocks,
    protocolsBlocks,
    operatorsBlocks,
    dataBlocks,
    myBlocks,
  ];
}
