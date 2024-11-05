import { Device } from '@capacitor/device';

export const DEVICE: {
  PLATFORM?: DEVICE_TYPE
} = {};

// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
void Device.getInfo().then((deviceInfo) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  DEVICE.PLATFORM = deviceInfo.platform as DEVICE_TYPE;
});

export enum DEVICE_TYPE {
  ios = 'ios',
  android = 'android',
  web = 'web'
}
