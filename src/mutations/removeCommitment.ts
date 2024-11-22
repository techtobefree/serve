import { useMutation } from "@tanstack/react-query";

import { supabase } from "../domains/db/supabaseClient";
import { partialQueryKey as projectByIdKey } from "../queries/projectById";
import { queryClient } from "../queries/queryClient";

export async function removeCommitment({ id, projectId }:
  {
    id: string,
    projectId: string,
  }) {

  await supabase
    .from('project_event_commitment')
    .delete()
    .eq('id', id)

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
      console.error('Error creating post:', error);
      callback?.(error);
    },
  });
}
