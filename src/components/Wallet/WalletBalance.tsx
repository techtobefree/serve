import { observer } from "mobx-react-lite";

import { userStore } from "../../domains/auth/sessionStore";
import { useQueryWalletBalance } from "../../domains/profile/queryWalletBalance";
import { formatPrice } from "../../domains/text/format";

interface WalletBalanceProps {
  userId?: string;
  extended?: boolean;
}

export function WalletBalanceComponent({
  userId,
  extended = false,
}: WalletBalanceProps) {
  const {
    data: walletBalance,
    isLoading,
    error,
  } = useQueryWalletBalance(userId || "", !!userId);

  if (!userId) {
    return null;
  }

  if (isLoading) {
    return <div>Loading balance...</div>;
  }

  if (error) {
    return <div>Error loading balance</div>;
  }

  if (extended) {
    return (
      <>
        <div>Wallet balance: {formatPrice(walletBalance?.balance || 0)}</div>
        {walletBalance?.balance === 0 ? (
          <div>
            Attend or lead service projects to earn points and redeem them for
            products.
          </div>
        ) : null}
      </>
    );
  }

  return <div>{formatPrice(walletBalance?.balance || 0)}</div>;
}

export const WalletBalance = observer(
  ({ extended }: { extended?: boolean } = {}) => {
    return (
      <WalletBalanceComponent
        userId={userStore.current?.id}
        extended={extended}
      />
    );
  }
);
