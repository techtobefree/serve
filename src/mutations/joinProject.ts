import { useMutation } from "@tanstack/react-query";

import { clientSupabase } from "../domains/db/clientSupabase";
import { showToast } from "../domains/ui/toast";
import { partialQueryKey as projectByIdKey } from "../queries/projectById";
import { queryClient } from "../queries/queryClient";

export async function joinProject({ projectId, userId }: { projectId: string, userId: string }) {
  const { error } = await clientSupabase
    .from('user_project')
    .insert({ project_id: projectId, created_by: userId, user_id: userId })
    .select('*')

  if (error) {
    showToast('Failed to join project', { duration: 5000, isError: true });
    throw error;
  }

  await queryClient.invalidateQueries({ queryKey: ['get-projectId', projectId] });
}

export default function useJoinProject(
  { projectId }: { projectId?: string },
  callback?: (err?: Error) => void) {
  return useMutation({
    mutationFn: joinProject,
    onSuccess: () => {
      // Invalidate queries to refetch updated data
      void queryClient.invalidateQueries({ queryKey: [projectByIdKey, projectId] });
      showToast('Following project', { duration: 3000 })
      callback?.();
    },
    onError: (error: Error) => {
      console.error('Error joining project:', error);
      callback?.(error);
    },
  });
}
