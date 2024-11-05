import { observer } from "mobx-react-lite";
import { currentUserStore } from "../../domains/auth/currentUser";
import Login from "./Login";

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
      {isLoggedIn && <div className="p-6 text-gray-700">Other stuff</div>}
    </>
  )
}

const ProfileModalContent = observer(() => {
  const { handle, loggedIn } = currentUserStore;
  return <ProfileModalContentComponent isLoggedIn={loggedIn} handle={handle} />
});

export default ProfileModalContent;
