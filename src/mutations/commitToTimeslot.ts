import { TZDate } from "@date-fns/tz";
import { useMutation } from "@tanstack/react-query";

import { tzDateToDB } from "../domains/date/timezone";
import { supabase } from "../domains/db/supabaseClient";
import { showToast } from "../domains/ui/toast";
import { partialQueryKey as projectByIdKey } from "../queries/projectById";
import { queryClient } from "../queries/queryClient";

export async function commitToTimeslot({ currentUserId, eventId, projectId, startTime, endTime }:
  {
    currentUserId: string,
    eventId: string,
    projectId: string,
    startTime: TZDate,
    endTime: TZDate
  }) {

  const { error } = await supabase
    .from('project_event_commitment')
    .insert({
      created_by: currentUserId,
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

  await queryClient.invalidateQueries({ queryKey: ['get-projectId', projectId] });
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
