import { useMutation } from "@tanstack/react-query";

import { clientSupabase } from "../persistence/clientSupabase";
import { queryClient } from "../persistence/queryClient";
import { showToast } from "../ui/toast";

import { partialQueryKey as projectByIdKey } from "./queryProjectById";

export async function leaveProject({
  projectId,
  userId,
}: {
  projectId: string;
  userId: string;
}) {
  const { error } = await clientSupabase
    .from("user_project")
    .delete()
    .eq("user_id", userId)
    .eq("project_id", projectId);

  if (error) {
    showToast("Failed to leave project", { duration: 5000, isError: true });
    throw error;
  }

  await queryClient.invalidateQueries({
    queryKey: [projectByIdKey, projectId],
  });
}

export default function useLeaveProject(
  { projectId }: { projectId?: string },
  callback?: (err?: Error) => void
) {
  return useMutation({
    mutationFn: leaveProject,
    onSuccess: () => {
      // Invalidate queries to refetch updated data
      void queryClient.invalidateQueries({
        queryKey: [projectByIdKey, projectId],
      });
      showToast("Project unfollowed", { duration: 3000 });
      callback?.();
    },
    onError: (error: Error) => {
      console.error("Error leaving project:", error);
      callback?.(error);
    },
  });
}
