import { Path, useNavigate } from "../../router";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const navigation: any;

export function back(navigate: ReturnType<typeof useNavigate>) {
  let destination: number | string = -1;
  if (!navigation) {
    navigate(destination)
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const navigationEntries = navigation.entries();

  if (!navigationEntries) {
    navigate(destination)
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument
  if (navigationEntries.length > 1 && /serve/.test(navigationEntries[navigationEntries.length - 1].url)) {
    // TODO enhance check to use ENV variable
    destination = '/projects'
  }
  navigate(destination as Path)
}
