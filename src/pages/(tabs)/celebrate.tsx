import { observer } from "mobx-react-lite";

import Products from "../../components/Products/Products";
import { userStore } from "../../domains/auth/sessionStore";

function CelebrateComponent({ userId }: { userId?: string }) {
  console.debug("CelebrateComponent userId", userId);

  return (
    <div className="flex justify-center">
      <Products />
    </div>
  );
}

const Celebrate = observer(() => {
  return <CelebrateComponent userId={userStore.current?.id} />;
});

export default Celebrate;
