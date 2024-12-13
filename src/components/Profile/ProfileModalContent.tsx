import { observer } from "mobx-react-lite";

import { userStore } from "../../domains/auth/sessionStore";
import { CurrentProfile, currentProfileStore } from "../../domains/currentUser/currentUserStore";

import LoggedIn from "./LoggedIn";
import Login from "./Login";

type Props = {
  isLoggedIn: boolean;
  currentProfile?: CurrentProfile;
}

export function ProfileModalContentComponent({ isLoggedIn, currentProfile }: Props) {
  return (
    <>
      {(!isLoggedIn || !currentProfile) && <Login />}
      {isLoggedIn && currentProfile && <LoggedIn currentProfile={currentProfile} />}
    </>
  )
}

const ProfileModalContent = observer(() => {
  const { current } = userStore;

  return <ProfileModalContentComponent isLoggedIn={!!current} currentProfile={{ ...currentProfileStore }} />
});

export default ProfileModalContent;
