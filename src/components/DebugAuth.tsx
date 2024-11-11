import { observer } from "mobx-react-lite";

import { sessionStore } from "../domains/auth/sessionStore";

const DebugAuth = observer(() => {
  const { current } = sessionStore;

  return (
    <div className="flex bg-red-600">
      {current ? current.user.id : 'No current'}
    </div>
  )
});

export default DebugAuth;