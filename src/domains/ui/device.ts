import { Device } from '@capacitor/device';

export const DEVICE: {
  PLATFORM?: DEVICE_TYPE
} = {};

void Device.getInfo().then((deviceInfo) => {
  DEVICE.PLATFORM = deviceInfo.platform as DEVICE_TYPE;
});

export enum DEVICE_TYPE {
  ios = 'ios',
  android = 'android',
  web = 'web'
}
