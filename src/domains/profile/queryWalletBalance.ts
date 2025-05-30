import { useQuery } from "@tanstack/react-query";

import { clientSupabase } from "../persistence/clientSupabase";

export const partialQueryKey = "get-wallet-balance";

export function useQueryWalletBalance(
  userId?: string,
  enabled: boolean = true
) {
  return useQuery({
    queryKey: [partialQueryKey, userId],
    enabled: !!userId && enabled,
    queryFn: async () => {
      if (!userId) {
        throw new Error("Missing user ID");
      }

      const { data, error } = await clientSupabase
        .from("wallet_balance")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          // No balance found, return null
          return { balance: 0, user_id: userId };
        }
        throw new Error(error.message);
      }

      return data;
    },
  });
}
