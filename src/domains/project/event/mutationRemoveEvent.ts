import { useMutation } from "@tanstack/react-query";

import { clientSupabase } from "../../persistence/clientSupabase";
import { queryClient } from "../../persistence/queryClient";
import { showToast } from "../../ui/toast";
import { partialQueryKey as projectByIdKey } from "../queryProjectById";

export async function removeEvent({ id, projectId }:
  {
    id: string,
    projectId: string,
  }) {

  const { error } = await clientSupabase
    .from('project_event')
    .delete()
    .eq('id', id)

  if (error) {
    showToast('Failed to delete event', { duration: 5000, isError: true });
    throw error;
  }

  await queryClient.invalidateQueries({ queryKey: [projectByIdKey, projectId] });
}

export default function useRemoveEvent(
  { projectId }: { projectId?: string },
  callback?: (err?: Error) => void) {
  return useMutation({
    mutationFn: removeEvent,
    onSuccess: () => {
      // Invalidate queries to refetch updated data
      void queryClient.invalidateQueries({ queryKey: [projectByIdKey, projectId] });
      showToast('Event deleted', { duration: 3000 })
      callback?.();
    },
    onError: (error: Error) => {
      console.error('Error removing event:', error);
      callback?.(error);
    },
  });
}
