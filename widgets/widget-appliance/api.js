'use strict';

function buildDeviceState(device, type) {
  const isWasher = type === 'washer';
  const stateKey = isWasher ? 'samsung_washer_current_job_state' : 'samsung_dryer_current_job_state';
  const progressKey = isWasher ? 'samsung_washer_progress_percentage' : 'samsung_dryer_progress_percentage';
  const remainingKey = isWasher ? 'samsung_washer_progress_remaining_time' : 'samsung_dryer_progress_remaining_time';

  let state = device.getCapabilityValue(stateKey);
  let progress = device.getCapabilityValue(progressKey);
  let remainingTime = device.getCapabilityValue(remainingKey);
  const power = device.getCapabilityValue('measure_power');
  const energy = device.getCapabilityValue('meter_power');
  const water = isWasher ? device.getCapabilityValue('meter_water') : null;
  const remoteEnabled = isWasher
    ? device.getCapabilityValue('samsung_washer_remote_control_enabled')
    : device.getCapabilityValue('samsung_dryer_remote_control_enabled');
  const detergent = isWasher ? device.getCapabilityValue('samsung_washer_auto_detergent_status') : null;
  const softener = isWasher ? device.getCapabilityValue('samsung_washer_auto_softener_status') : null;

  if (state === 'none') state = 'off';
  if (state === 'off') remainingTime = '-';
  if (progress === 1) progress = 0;

  return {
    name: device.getName(),
    type,
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
}

module.exports = {
  async getDeviceState({ homey, query }) {
    const { deviceId } = query;

    // Try washer driver first
    try {
      const washerDriver = await homey.drivers.getDriver('washer');
      const washerDevices = washerDriver.getDevices();
      const device = washerDevices.find(d => d.getId() === deviceId);
      if (device) {
        return buildDeviceState(device, 'washer');
      }
    } catch (e) { /* driver not found */ }

    // Try dryer driver
    try {
      const dryerDriver = await homey.drivers.getDriver('dryer');
      const dryerDevices = dryerDriver.getDevices();
      const device = dryerDevices.find(d => d.getId() === deviceId);
      if (device) {
        return buildDeviceState(device, 'dryer');
      }
    } catch (e) { /* driver not found */ }

    throw new Error('Device not found');
  },
};
