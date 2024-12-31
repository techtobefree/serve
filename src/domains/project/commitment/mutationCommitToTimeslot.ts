import { TZDate } from "@date-fns/tz";
import { useMutation } from "@tanstack/react-query";

import { tzDateToDB } from "../../date/timezone";
import { clientSupabase } from "../../persistence/clientSupabase";
import { showToast } from "../../ui/toast";
import { partialQueryKey as projectByIdKey } from "../queryProjectById";
import { queryClient } from "../../persistence/queryClient";
import { userStore } from "../../auth/sessionStore";

export async function commitToTimeslot({ eventId, projectId, startTime, endTime }:
  {
    eventId: string,
    projectId: string,
    startTime: TZDate,
    endTime: TZDate
  }) {

  if (!userStore.current) {
    throw new Error('Missing user info');
  }

  const { error } = await clientSupabase
    .from('project_event_commitment')
    .insert({
      created_by: userStore.current?.id,
      project_id: projectId,
      commitment_start: tzDateToDB(startTime),
      commitment_end: tzDateToDB(endTime),
      project_event_id: eventId,
      role: 'Volunteer',
    })
    .select('*')

  if (error) {
    showToast('Failed to commit to timeslot', { duration: 5000, isError: true });
    throw error;
  }

  await queryClient.invalidateQueries({ queryKey: [projectByIdKey, projectId] });
}

export default function useCommitToTimeslot(
  { projectId }: { projectId?: string },
  callback?: (err?: Error) => void) {
  return useMutation({
    mutationFn: commitToTimeslot,
    onSuccess: () => {
      // Invalidate queries to refetch updated data
      void queryClient.invalidateQueries({ queryKey: [projectByIdKey, projectId] });
      showToast('Committed to serve')
      callback?.();
    },
    onError: (error: Error) => {
      console.error('Error creating commitment:', error);
      callback?.(error);
    },
  });
}
