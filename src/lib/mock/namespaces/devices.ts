export function createDevicesApi() {
  return {
    async list() {
      return { devices: [] };
    },

    async registerPushToken(input: { deviceId?: string; name: string; platform: 'ios' | 'android' | 'web'; pushToken: string }) {
      return { device: { id: input.deviceId ?? `device_${Date.now().toString(36)}` } };
    }
  };
}
