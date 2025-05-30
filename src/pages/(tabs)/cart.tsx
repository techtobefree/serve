import { observer } from "mobx-react-lite";

import { ShoppingCart } from "../../components/ShoppingCart/ShoppingCart";
import { userStore } from "../../domains/auth/sessionStore";

function CartComponent({ userId }: { userId?: string }) {
  console.debug("CelebrateComponent userId", userId);

  return (
    <div className="flex justify-center p-4">
      <ShoppingCart />
    </div>
  );
}

const Cart = observer(() => {
  return <CartComponent userId={userStore.current?.id} />;
});

export default Cart;
