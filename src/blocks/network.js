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
      text: translate('esp32.blocks.connectWifi', 'connect wifi ssid %1 password %2'),
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
        this.definitions_['wlan'] = 'wlan = network.WLAN()';
        this.definitions_['active_wlan'] = 'wlan.active(True)';

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
        this.definitions_['wlan'] = 'wlan = network.WLAN()';
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
        this.definitions_['wlan'] = 'wlan = network.WLAN()';
        return ['wlan.isconnected()', this.ORDER_FUNCTION_CALL];
      },
    },
    '---',
    {
      id: 'wifiscan',
      text: translate('esp32.blocks.wifiScan', 'start scan wifi'),
      mpy(block) {
        this.definitions_['import_network'] = 'import network';
        this.definitions_['wlan'] = 'wlan = network.WLAN()';
        this.definitions_['active_wlan'] = 'wlan.active(True)';
        this.definitions_['wifi_list'] = 'wifi_list = []';
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
        this.definitions_['import_network'] = 'import network';
        this.definitions_['wlan'] = 'wlan = network.WLAN()';
        this.definitions_['wifi_list'] = 'wifi_list = []';
      },
    },
    {
      id: 'wificounts',
      text: translate('esp32.blocks.wifiCounts', 'available wifi counts'),
      output: 'number',
      mpy(block) {
        this.definitions_['import_network'] = 'import network';
        this.definitions_['wlan'] = 'wlan = network.WLAN()';
        this.definitions_['wifi_list'] = 'wifi_list = []';
      },
    },
    '---',
  ],
});
