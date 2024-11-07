import { observer } from "mobx-react-lite";
import { sessionStore } from "../../domains/auth/sessionStore";
import Login from "./Login";
import LoggedIn from "./LoggedIn";

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
