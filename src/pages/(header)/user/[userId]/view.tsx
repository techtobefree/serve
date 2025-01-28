import { observer } from "mobx-react-lite";

import { Profile } from "../../../../components/Profile/Profile";
import { userStore } from "../../../../domains/auth/sessionStore";
import { useParams } from "../../../../router";

export const UserViewPage = observer(() => {
  const { userId } = useParams("/user/:userId/view");
  const currentUserId = userStore.current?.id;

  return <Profile userId={userId} canEdit={userId === currentUserId} />;
});

export default UserViewPage;
