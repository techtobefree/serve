import { useMutation } from "@tanstack/react-query";

import { supabase } from "../domains/db/supabaseClient";
import { showToast } from "../domains/ui/toast";
import { partialQueryKey as projectByIdKey } from "../queries/projectById";
import { queryClient } from "../queries/queryClient";

export async function removeTimeslot({ id, projectId }:
  {
    id: string,
    projectId: string,
  }) {

  const { error } = await supabase
    .from('project_event_timeslot')
    .delete()
    .eq('id', id)

  if (error) {
    showToast('Failed to delete timeslot', { duration: 5000, isError: true });
    throw error;
  }

  await queryClient.invalidateQueries({ queryKey: ['get-projectId', projectId] });
}

export default function useRemoveTimeslot(
  { projectId }: { projectId?: string },
  callback?: (err?: Error) => void) {
  return useMutation({
    mutationFn: removeTimeslot,
    onSuccess: () => {
      // Invalidate queries to refetch updated data
      void queryClient.invalidateQueries({ queryKey: [projectByIdKey, projectId] });
      showToast('Timeslot deleted', { duration: 3000 });
      callback?.();
    },
    onError: (error: Error) => {
      console.error('Error removing timeslot:', error);
      callback?.(error);
    },
  });
}
