import { observer } from "mobx-react-lite";

import { userStore } from "../domains/auth/sessionStore";

const DebugAuth = observer(() => {
  const { current } = userStore;

  return (
    <div className="flex bg-red-600">
      {current ? current.id : 'No current'}
    </div>
  )
});

export default DebugAuth;