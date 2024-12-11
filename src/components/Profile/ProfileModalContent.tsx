import { observer } from "mobx-react-lite";

import { sessionStore } from "../../domains/auth/sessionStore";
import { CurrentUser, currentUserStore } from "../../domains/currentUser/currentUserStore";

import LoggedIn from "./LoggedIn";
import Login from "./Login";

type Props = {
  isLoggedIn: boolean;
  currentUser?: CurrentUser;
}

export function ProfileModalContentComponent({ isLoggedIn, currentUser }: Props) {
  return (
    <>
      {(!isLoggedIn || !currentUser) && <Login />}
      {isLoggedIn && currentUser && <LoggedIn currentUser={currentUser} />}
    </>
  )
}

const ProfileModalContent = observer(() => {
  const { current } = sessionStore;
  const currentUser = currentUserStore;

  return <ProfileModalContentComponent isLoggedIn={!!current} currentUser={{ ...currentUser }} />
});

export default ProfileModalContent;
