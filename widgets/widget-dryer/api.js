'use strict';

module.exports = {
  async getDryerState({ homey, query }) {
    const selectedDeviceId = query.deviceId;

    const driver = await homey.drivers.getDriver('dryer');
    const devices = driver.getDevices();
    const device = devices.find(d => d.getId() === selectedDeviceId);

    if (!device) throw new Error('Device not found');

    const name = await device.getName();
    let state = device.getCapabilityValue('samsung_dryer_current_job_state');
    let progress = device.getCapabilityValue('samsung_dryer_progress_percentage');
    let remainingTime = device.getCapabilityValue('samsung_dryer_progress_remaining_time');
    const power = device.getCapabilityValue('measure_power');
    const energy = device.getCapabilityValue('meter_power');
    const remoteEnabled = device.getCapabilityValue('samsung_dryer_remote_control_enabled');

    if (state === 'none') state = 'off';
    if (state === 'off') remainingTime = '-';
    if (progress === 1) progress = 0;

    return {
      name,
      state,
      progress,
      remainingTime,
      power: typeof power === 'number' ? power : null,
      energy: typeof energy === 'number' ? energy : null,
      remoteEnabled: remoteEnabled === true,
    };
  },
};
