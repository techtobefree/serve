import { observer } from "mobx-react-lite";

import { userStore } from "../../../../domains/auth/sessionStore";
import { loggedInProfileStore } from "../../../../domains/profile/loggedInProfileStore";
import { useParams } from "../../../../router"
import { Profile } from "../../../../components/Profile/Profile";

export const UserViewPage = observer(() => {
  const { userId } = useParams('/user/:userId/view')
  const currentUserId = userStore.current?.id;

  return (
    <Profile
      userId={userId}
      canEdit={userId === currentUserId}
      acceptedAt={loggedInProfileStore.acceptedAt} />
  )
});

export default UserViewPage;
