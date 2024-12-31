import { useMutation } from "@tanstack/react-query";

import { clientSupabase } from "../persistence/clientSupabase";
import { queryClient } from "../persistence/queryClient";
import { showToast } from "../ui/toast";

import { partialQueryKey as projectByIdKey } from "./queryProjectById";

export async function deleteProject({ projectId }: { projectId: string }) {
  const { error } = await clientSupabase
    .from('project')
    .delete()
    .eq('id', projectId);

  if (error) {
    showToast('Failed to delete project', { duration: 5000, isError: true });
    throw error;
  }

  await queryClient.invalidateQueries({ queryKey: [projectByIdKey, projectId] });
}

export default function useDeleteProject(
  { projectId, userId }: { projectId?: string, userId?: string },
  callback?: (err?: Error) => void) {
  return useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      // Invalidate queries to refetch updated data
      void queryClient.invalidateQueries({ queryKey: [projectByIdKey, projectId] });
      void queryClient.invalidateQueries({ queryKey: ['my-admin-projects', userId] });
      void queryClient.invalidateQueries({ queryKey: ['my-attending-projects', userId] });
      void queryClient.invalidateQueries({ queryKey: 'all-projects' });

      showToast('Project deleted', { duration: 3000 })
      callback?.();
    },
    onError: (error: Error) => {
      console.error('Error deleting project:', error);
      callback?.(error);
    },
  });
}
