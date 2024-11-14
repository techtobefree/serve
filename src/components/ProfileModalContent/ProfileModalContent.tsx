import { observer } from "mobx-react-lite";

import { sessionStore } from "../../domains/auth/sessionStore";
import { useMyProfileQuery } from "../../queries/myProfile";

import LoggedIn from "./LoggedIn";
import Login from "./Login";

type Props = {
  isLoggedIn: boolean;
  userId?: string;
}

export function ProfileModalContentComponent({ isLoggedIn, userId }: Props) {
  const { data } = useMyProfileQuery(userId)
  return (
    <>
      {(!isLoggedIn || !userId) && <Login />}
      {isLoggedIn && userId && <LoggedIn handle={data?.handle || 'Loading'} userId={userId} />}
    </>
  )
}

const ProfileModalContent = observer(() => {
  const { current } = sessionStore;

  return <ProfileModalContentComponent isLoggedIn={!!current} userId={current?.user.id} />
});

export default ProfileModalContent;
