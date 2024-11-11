import { Path, useNavigate } from "../../router";

import { DEVICE, DEVICE_TYPE } from "./device";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const navigation: any;

export function back(navigate: ReturnType<typeof useNavigate>) {
  let destination: number | string = -1;
  if (DEVICE.PLATFORM !== DEVICE_TYPE.web) {
    navigate(destination)
  }

  if (!navigation) {
    navigate(destination)
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const navigationEntries = navigation.entries();

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  if (!navigationEntries || !navigationEntries[navigationEntries.length - 1].url) {
    navigate(destination)
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  if (navigationEntries.length > 1 && /serve/
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    .test(navigationEntries[navigationEntries.length - 1].url)) {
    // TODO enhance check to use ENV variable
    destination = '/projects'
  }
  navigate(destination as Path)
}
