import { useMutation } from "@tanstack/react-query";

import { clientSupabase } from "../../persistence/clientSupabase";
import { queryClient } from "../../persistence/queryClient";
import { showToast } from "../../ui/toast";
import { partialQueryKey as projectByIdKey } from "../queryProjectById";

export async function removeCommitment({
  id,
  projectId,
}: {
  id: string;
  projectId: string;
}) {
  const { error } = await clientSupabase
    .from("project_event_commitment")
    .delete()
    .eq("id", id);

  if (error) {
    showToast("Failed to delete commitment", { duration: 5000, isError: true });
    throw error;
  }

  await queryClient.invalidateQueries({
    queryKey: [projectByIdKey, projectId],
  });
}

export default function useRemoveCommitment(
  { projectId }: { projectId?: string },
  callback?: (err?: Error) => void
) {
  return useMutation({
    mutationFn: removeCommitment,
    onSuccess: () => {
      // Invalidate queries to refetch updated data
      void queryClient.invalidateQueries({
        queryKey: [projectByIdKey, projectId],
      });
      showToast("Commitment deleted", { duration: 3000 });
      callback?.();
    },
    onError: (error: Error) => {
      console.error("Error removing commitment:", error);
      callback?.(error);
    },
  });
}
