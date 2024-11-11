import { observer } from "mobx-react-lite";

import { sessionStore } from "../../domains/auth/sessionStore";

import LoggedIn from "./LoggedIn";
import Login from "./Login";

type Props = {
  isLoggedIn: boolean;
  handle: string;
}

export function ProfileModalContentComponent({ isLoggedIn, handle }: Props) {

  return (
    <>
      {!isLoggedIn && <Login />}
      {isLoggedIn && <LoggedIn handle={handle} />}
    </>
  )
}

const ProfileModalContent = observer(() => {
  const { current } = sessionStore;

  return <ProfileModalContentComponent isLoggedIn={!!current} handle={'No handle'} />
});

export default ProfileModalContent;
