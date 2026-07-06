'use strict';

module.exports = {
  async getWasherState({ homey, query }) {
    const selectedDeviceId = query.deviceId;

    const driver = await homey.drivers.getDriver('washer');
    const devices = driver.getDevices();
    const device = devices.find(d => d.getId() === selectedDeviceId);

    if (!device) throw new Error('Device not found');

    const name = await device.getName();
    let state = device.getCapabilityValue('samsung_washer_current_job_state');
    let progress = device.getCapabilityValue('samsung_washer_progress_percentage');
    let remainingTime = device.getCapabilityValue('samsung_washer_progress_remaining_time');
    const power = device.getCapabilityValue('measure_power');
    const energy = device.getCapabilityValue('meter_power');
    const water = device.getCapabilityValue('meter_water');
    const remoteEnabled = device.getCapabilityValue('samsung_washer_remote_control_enabled');
    const detergent = device.getCapabilityValue('samsung_washer_auto_detergent_status');
    const softener = device.getCapabilityValue('samsung_washer_auto_softener_status');

    if (state === 'none') state = 'off';
    if (state === 'off') remainingTime = '-';
    if (progress === 1) progress = 0;

    return {
      name,
      state,
      progress: state === 'off' ? 0 : (progress || 0),
      remainingTime,
      power: typeof power === 'number' ? power : null,
      energy: typeof energy === 'number' ? energy : null,
      water: typeof water === 'number' ? (water * 1000) : null,
      remoteEnabled: remoteEnabled === true,
      detergent: detergent || null,
      softener: softener || null,
    };
  },
};
