import { useMutation } from "@tanstack/react-query";

import { supabase } from "../domains/db/supabaseClient";
import { showToast } from "../domains/ui/toast";
import { partialQueryKey as projectByIdKey } from "../queries/projectById";
import { queryClient } from "../queries/queryClient";

export async function removeCommitment({ id, projectId }:
  {
    id: string,
    projectId: string,
  }) {

  const { error } = await supabase
    .from('project_event_commitment')
    .delete()
    .eq('id', id)

  if (error) {
    showToast('Failed to delete commitment', { duration: 5000, isError: true });
    throw error;
  }

  await queryClient.invalidateQueries({ queryKey: ['get-projectId', projectId] });
}

export default function useRemoveCommitment(
  { projectId }: { projectId?: string },
  callback?: (err?: Error) => void) {
  return useMutation({
    mutationFn: removeCommitment,
    onSuccess: () => {
      // Invalidate queries to refetch updated data
      void queryClient.invalidateQueries({ queryKey: [projectByIdKey, projectId] });
      callback?.();
    },
    onError: (error: Error) => {
      console.error('Error removing commitment:', error);
      callback?.(error);
    },
  });
}
