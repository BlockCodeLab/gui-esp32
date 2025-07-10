import getPinsBlocks from './pins';
import getTextBlocks from './text';
import getSerialBlocks from './serial';
import getEventsBlocks from './events';
import getControlBlocks from './control';
import getProtocolsBlocks from './protocols';
import getOperatorsBlocks from './operators';
import getDataBlocks from './data';
import getMyBlocks from './procedures';

export { ESP32Generator } from './generator';

export { VARIABLE_TYPES } from './data';

export function buildBlocks(boardType, classicEvents) {
  const pinsBlocks = getPinsBlocks(boardType);
  const textBlocks = getTextBlocks();
  const serialBlocks = getSerialBlocks();
  const eventsBlocks = getEventsBlocks(classicEvents);
  const controlBlocks = getControlBlocks();
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
    protocolsBlocks,
    operatorsBlocks,
    dataBlocks,
    myBlocks,
  ];
}
