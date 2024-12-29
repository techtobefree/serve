import { observer } from "mobx-react-lite";

import { userStore } from "../../domains/auth/sessionStore";
import { LoggedInProfile, loggedInProfileStore } from "../../domains/profile/loggedInProfileStore";

import LoggedIn from "./LoggedIn";
import LoggedOut from "./LoggedOut";

type Props = {
  isLoggedIn: boolean;
  currentProfile?: LoggedInProfile;
}

export function ProfileModalContentComponent({ isLoggedIn, currentProfile }: Props) {
  return (
    <>
      {(!isLoggedIn || !currentProfile) && <LoggedOut />}
      {isLoggedIn && currentProfile && <LoggedIn currentProfile={currentProfile} />}
    </>
  )
}

const ProfileModalContent = observer(() => {
  const { current } = userStore;

  return <ProfileModalContentComponent isLoggedIn={!!current} currentProfile={{ ...loggedInProfileStore }} />
});

export default ProfileModalContent;
