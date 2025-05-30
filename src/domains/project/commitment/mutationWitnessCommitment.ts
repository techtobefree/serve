import { useMutation } from "@tanstack/react-query";

import { userStore } from "../../auth/sessionStore";
import { clientSupabase } from "../../persistence/clientSupabase";
import { queryClient } from "../../persistence/queryClient";
import { partialQueryKey as walletBalanceQueryKey } from "../../profile/queryWalletBalance";
import { showToast } from "../../ui/toast";

export async function witnessCommitments({
  projectId,
  userId,
  witnessTargets,
}: {
  projectId?: string;
  userId: string;
  witnessTargets: Array<{
    userId: string;
    commitmentId: string;
  }>;
}) {
  const currentUserId = userStore.current?.id;
  if (!currentUserId) {
    throw new Error("Missing user info");
  }

  // Insert witness records for all targets
  const witnessRecords = witnessTargets.map((target) => ({
    project_id: projectId,
    manual_user_id: userId,
    witnessed_user_id: target.userId,
    commitment_id: target.commitmentId,
    created_by: currentUserId,
  }));

  const { error } = await clientSupabase.from("witness").insert(witnessRecords);

  if (error) {
    showToast("Failed to witness commitment", {
      duration: 5000,
      isError: true,
    });
    throw error;
  }

  await queryClient.invalidateQueries({
    queryKey: [walletBalanceQueryKey, userId],
  });
}

export default function useWitnessCommitments(
  { userId }: { userId?: string },
  callback?: (err?: Error) => void
) {
  return useMutation({
    mutationFn: witnessCommitments,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: [walletBalanceQueryKey, userId],
      });
      showToast("Commitment witnessed successfully");
      callback?.();
    },
    onError: (error: Error) => {
      console.error("Error witnessing commitment:", error);
      callback?.(error);
    },
  });
}
