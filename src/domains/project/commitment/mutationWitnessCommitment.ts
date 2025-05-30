import { useMutation } from "@tanstack/react-query";

import { userStore } from "../../auth/sessionStore";
import { clientSupabase } from "../../persistence/clientSupabase";
import { queryClient } from "../../persistence/queryClient";
import { showToast } from "../../ui/toast";
// import { partialQueryKey as projectByIdKey } from "../queryProjectById";

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
    // queryKey: [projectByIdKey, actualProjectId],
  });
}

export default function useWitnessCommitments(
  callback?: (err?: Error) => void
) {
  return useMutation({
    mutationFn: witnessCommitments,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        // queryKey: [projectByIdKey, projectId],
        // invalidate the "wallet" query to refresh user data
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
