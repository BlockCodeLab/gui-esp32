import { translate, themeColors } from '@blockcode/core';

export default () => ({
  id: 'network',
  name: translate('esp32.blocks.network', 'Network'),
  themeColor: '#28A0DC',
  inputColor: '#42A8DB',
  otherColor: '#1386BF',
  order: 6,
  blocks: [
    {
      id: 'connectwifi',
      text: translate('esp32.blocks.connectWifi', 'connect wifi ssid: %1 password: %2'),
      inputs: {
        SSID: {
          type: 'string',
          defaultValue: 'esp32',
        },
        PASSWORD: {
          type: 'string',
          defaultValue: '12345678',
        },
      },
      mpy(block) {
        const ssid = this.valueToCode(block, 'SSID', this.ORDER_NONE);
        const pass = this.valueToCode(block, 'PASSWORD', this.ORDER_NONE);
        this.definitions_['import_threading'] = 'import _thread as threading';
        this.definitions_['import_network'] = 'import network';
        this.definitions_['wlan'] = 'wlan = network.WLAN(); wlan.active(True)';

        let code = '';
        code += 'threading.start_new_thread(';
        code += `lambda: wlan.connect(${ssid}, ${pass})`;
        code += ', ())\n';
        code += 'while wlan.active() and not wlan.isconnected(): '; // while 写在一行
        code += 'await asyncio.sleep_ms(500)\n'; // 每 500ms 检查一次
        return code;
      },
    },
    {
      id: 'disconnect',
      text: translate('esp32.blocks.disconnectWifi', 'disconnect wifi'),
      mpy(block) {
        this.definitions_['import_network'] = 'import network';
        this.definitions_['wlan'] = 'wlan = network.WLAN(); wlan.active(True)';
        let code = '';
        code += 'wlan.disconnect()\n';
        code += 'wlan.active(False)\n';
        return code;
      },
    },
    {
      id: 'isconnected',
      text: translate('esp32.blocks.isWifiConnected', 'wifi is connected?'),
      output: 'boolean',
      mpy(block) {
        this.definitions_['import_network'] = 'import network';
        this.definitions_['wlan'] = 'wlan = network.WLAN(); wlan.active(True)';
        return ['wlan.isconnected()', this.ORDER_FUNCTION_CALL];
      },
    },
    '---',
    {
      id: 'wifiscan',
      text: translate('esp32.blocks.wifiScan', 'start scan wifi'),
      mpy(block) {
        this.definitions_['import_threading'] = 'import _thread as threading';
        this.definitions_['import_network'] = 'import network';
        this.definitions_['wlan'] = 'wlan = network.WLAN(); wlan.active(True)';
        this.definitions_['wifi_list'] = 'wifi_list = []';
        let code = '';
        code += 'threading.start_new_thread(';
        code += `lambda: wifi_list.extend(wlan.scan())`;
        code += ', ())\n';
        return code;
      },
    },
    {
      id: 'wifiitem',
      text: translate('esp32.blocks.wifiItem', '%2 of item %1 of available wifi'),
      output: 'number',
      inputs: {
        INDEX: {
          type: 'integer',
          defaultValue: 1,
        },
        ITEM: {
          menu: [
            [translate('esp32.blocks.wifiItemSsid', 'ssid'), 'SSID'],
            [translate('esp32.blocks.wifiItemMac', 'mac'), 'MAC'],
            [translate('esp32.blocks.wifiItemRssi', 'rssi'), 'RSSI'],
            [translate('esp32.blocks.wifiItemSecurity', 'security'), 'SECURITY'],
          ],
        },
      },
      mpy(block) {
        const index = this.getAdjustedInt(block, 'INDEX') || 0;
        const item = block.getFieldValue('ITEM') || 'SSID';
        this.definitions_['import_network'] = 'import network';
        this.definitions_['wlan'] = 'wlan = network.WLAN(); wlan.active(True)';
        this.definitions_['wifi_list'] = 'wifi_list = []';
        let code = `wifi_list[${index}]`;
        switch (item) {
          case 'MAC':
            code += '[1]';
            break;
          case 'RSSI':
            code += '[3]';
            break;
          case 'SECURITY':
            code += '[4]';
            break;
          default:
            code += '[0]';
            break;
        }
        return [code, this.ORDER_ATOMIC];
      },
    },
    {
      id: 'wificounts',
      text: translate('esp32.blocks.wifiCounts', 'available wifi counts'),
      output: 'number',
      mpy(block) {
        this.definitions_['import_network'] = 'import network';
        this.definitions_['wlan'] = 'wlan = network.WLAN(); wlan.active(True)';
        this.definitions_['wifi_list'] = 'wifi_list = []';
        return ['len(wifi_list)', this.ORDER_FUNCTION_CALL];
      },
    },
    '---',
    {
      id: 'startap',
      text: translate('esp32.blocks.startap', 'start ap ssid: %1'),
      inputs: {
        SSID: {
          type: 'string',
          defaultValue: 'esp-ap',
        },
      },
      mpy(block) {
        const ssid = this.valueToCode(block, 'SSID', this.ORDER_NONE);
        this.definitions_['import_network'] = 'import network';
        this.definitions_['ap'] = 'ap = network.WLAN(network.WLAN.IF_AP)';
        let code = '';
        code += `ap.config(ssid=${ssid})\n`;
        code += 'ap.active(True)\n';
        return code;
      },
    },
    {
      id: 'stopap',
      text: translate('esp32.blocks.stopap', 'stop ap'),
      mpy(block) {
        this.definitions_['import_network'] = 'import network';
        this.definitions_['ap'] = 'ap = network.WLAN(network.AP_IF)';
        return 'ap.active(False)\n';
      },
    },
    '---',
    {
      id: 'espnowsend',
      text: translate('esp32.blocks.espnowSend', 'send esp-now message %1 to %2'),
      inputs: {
        MESSAGE: {
          type: 'string',
          defaultValue: 'hello',
        },
        MAC: {
          type: 'string',
          defaultValue: 'ff:ff:ff:ff:ff:ff',
        },
      },
      mpy(block) {
        const msg = this.valueToCode(block, 'MESSAGE', this.ORDER_NONE);
        const mac = this.valueToCode(block, 'MAC', this.ORDER_NONE);
        this.definitions_['import_network'] = 'import network';
        this.definitions_['import_aioespnow'] = 'from aioespnow import AIOESPNow';
        this.definitions_['wlan'] = 'wlan = network.WLAN(); wlan.active(True)';
        this.definitions_['espnow'] = 'espnow = AIOESPNow(); espnow.active(True)';

        // espnow 发送辅助函数
        let code = '';
        code += 'async def espnow_asend(mac, msg):\n';
        code += `${this.INDENT}mac_addr = bytes.fromhex(mac.replace(':', ''))\n`;
        code += `${this.INDENT}try:\n`;
        code += `${this.INDENT}${this.INDENT}await espnow.asend(mac_addr, msg.encode())\n`;
        code += `${this.INDENT}except OSError as err:\n`;
        code += `${this.INDENT}${this.INDENT}if len(err.args) > 1 and err.args[1] == 'ESP_ERR_ESPNOW_NOT_FOUND':\n`;
        code += `${this.INDENT}${this.INDENT}${this.INDENT}espnow.add_peer(mac_addr)\n`;
        code += `${this.INDENT}${this.INDENT}${this.INDENT}await espnow.asend(mac_addr, msg.encode())\n`;
        this.definitions_['espnow_asend'] = code;

        return `await espnow_asend(${mac}, ${msg})\n`;
      },
    },
    {
      id: 'espnowrecv',
      text: translate('esp32.blocks.espnowRecv', 'wait for esp-now incoming'),
      mpy(block) {
        this.definitions_['import_network'] = 'import network';
        this.definitions_['import_aioespnow'] = 'from aioespnow import AIOESPNow';
        this.definitions_['wlan'] = 'wlan = network.WLAN(); wlan.active(True)';
        this.definitions_['espnow'] = 'espnow = AIOESPNow(); espnow.active(True)';
        const code = `peer, msg = await espnow.arecv()\n`;
        return code;
      },
    },
    {
      id: 'espnowmsg',
      text: translate('esp32.blocks.espnowMsg', '%1 of incoming'),
      output: 'string',
      inputs: {
        TYPE: {
          menu: [
            [translate('esp32.blocks.espnowMsgText', 'message'), 'MESSAGE'],
            [translate('esp32.blocks.espnowMsgMac', 'mac'), 'MAC'],
          ],
        },
      },
      mpy(block) {
        const type = block.getFieldValue('TYPE') || 'MESSAGE';
        this.definitions_['import_network'] = 'import network';
        this.definitions_['import_aioespnow'] = 'from aioespnow import AIOESPNow';
        this.definitions_['wlan'] = 'wlan = network.WLAN(); wlan.active(True)';
        this.definitions_['espnow'] = 'espnow = AIOESPNow(); espnow.active(True)';
        const code = type === 'MAC' ? 'peer' : 'msg';
        return [code, this.ORDER_ATOMIC];
      },
    },
    '---',
    {
      id: 'espnowrepeat',
      text: translate('esp32.blocks.espnowRepeat', 'repeat wait for esp-now incoming'),
      repeat: true,
      end: true,
      mpy(block) {
        this.definitions_['import_network'] = 'import network';
        this.definitions_['import_aioespnow'] = 'from aioespnow import AIOESPNow';
        this.definitions_['wlan'] = 'wlan = network.WLAN(); wlan.active(True)';
        this.definitions_['espnow'] = 'espnow = AIOESPNow(); espnow.active(True)';

        let branchCode = this.statementToCode(block, 'SUBSTACK');
        branchCode = this.addLoopTrap(branchCode, block.id);
        let code = '';
        code += 'async for peer, msg in espnow:\n';
        code += branchCode;
        return code;
      },
    },
  ],
});
