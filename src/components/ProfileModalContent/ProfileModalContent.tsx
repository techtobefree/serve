import { observer } from "mobx-react-lite";
import { sessionStore } from "../../domains/auth/sessionStore";
import Login from "./Login";
import LoggedIn from "./LoggedIn";

type Props = {
  isLoggedIn: boolean;
  handle?: string;
}

export function ProfileModalContentComponent({ isLoggedIn, handle }: Props) {
  return (
    <>
      {/* Modal Header */}
      {!isLoggedIn && <h2 className="text-lg font-semibold p-6 border-b border-gray-200">Not logged in</h2>}
      {isLoggedIn && <h2 className="text-lg font-semibold p-6 border-b border-gray-200">{handle}</h2>}

      {/* Modal Body */}
      {!isLoggedIn && <Login />}
      {isLoggedIn && <LoggedIn />}
    </>
  )
}

const ProfileModalContent = observer(() => {
  const { current } = sessionStore;

  return <ProfileModalContentComponent isLoggedIn={!!current} handle={current?.user.id} />
});

export default ProfileModalContent;
