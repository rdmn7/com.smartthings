'use strict';

const SmartThingsDevice = require('../../lib/SmartThingsDevice');

module.exports = class SmartThingsDeviceTV extends SmartThingsDevice {

  static CAPABILITIES = [
    {
      homeyCapabilityId: 'onoff',
      smartThingsComponentId: 'main',
      smartThingsCapabilityId: 'switch',
      smartThingsAttributeId: 'switch',
      async onSet({ value }) {
        await this.executeCommand({
          component: 'main',
          capability: 'switch',
          command: value
            ? 'on'
            : 'off',
        });
      },
      async onReport({ value }) {
        return value === 'on';
      },
    },
    {
      homeyCapabilityId: 'volume_up',
      smartThingsComponentId: 'main',
      smartThingsCapabilityId: 'audioVolume',
      async onSet() {
        await this.executeCommand({
          component: 'main',
          capability: 'audioVolume',
          command: 'volumeUp',
        });
      },
    },
    {
      homeyCapabilityId: 'volume_down',
      smartThingsComponentId: 'main',
      smartThingsCapabilityId: 'audioVolume',
      async onSet() {
        await this.executeCommand({
          component: 'main',
          capability: 'audioVolume',
          command: 'volumeDown',
        });
      },
    },
    {
      homeyCapabilityId: 'channel_up',
      smartThingsComponentId: 'main',
      smartThingsCapabilityId: 'tvChannel',
      async onSet() {
        await this.executeCommand({
          component: 'main',
          capability: 'tvChannel',
          command: 'channelUp',
        });
      },
    },
    {
      homeyCapabilityId: 'channel_down',
      smartThingsComponentId: 'main',
      smartThingsCapabilityId: 'tvChannel',
      async onSet() {
        await this.executeCommand({
          component: 'main',
          capability: 'tvChannel',
          command: 'channelDown',
        });
      },
    },
    // Power (W)
    {
      homeyCapabilityId: 'measure_power',
      smartThingsComponentId: 'main',
      smartThingsCapabilityId: 'powerConsumptionReport',
      smartThingsAttributeId: 'powerConsumption',
      async onReport({ value }) {
        return this.constructor.getPowerConsumptionValue(value, 'power');
      },
    },
    // Energy (kWh) — powerConsumption.energy is in Wh
    {
      homeyCapabilityId: 'meter_power',
      smartThingsComponentId: 'main',
      smartThingsCapabilityId: 'powerConsumptionReport',
      smartThingsAttributeId: 'powerConsumption',
      async onReport({ value }) {
        return this.constructor.getPowerConsumptionValue(value, 'energy', 1000);
      },
    },
  ];

  // We haven't found a TV that supports the `samsungTV` capability yet.
  // onFlowActionShowMessage = async ({ message }) => {
  //   const { deviceId } = this.getData();
  //   await this.oAuth2Client.executeDeviceCommand({
  //     deviceId,
  //     component: 'main',
  //     capability: 'samsungTV',
  //     command: 'showMessage',
  //     args: [message],
  //   });
  // }

};
