import { useMutation } from "@tanstack/react-query";

import { supabase } from "../domains/db/supabaseClient";
import { showToast } from "../domains/ui/toast";
import { partialQueryKey as projectByIdKey } from "../queries/projectById";
import { queryClient } from "../queries/queryClient";

export type Timeslot = {
  hour: number;
  minute: number;
  count: number;
}

async function createTimeslots({
  eventId,
  projectId,
  userId,
  durationMinutes,
  timeslots,
}: {
  eventId: string,
  projectId: string,
  userId: string,
  durationMinutes: number,
  timeslots: Timeslot[],
}) {
  const { error } = await supabase
    .from('project_event_timeslot')
    .insert(timeslots.map(timeslot => ({
      project_event_id: eventId,
      project_id: projectId,
      created_by: userId,
      timeslot_duration_minutes: durationMinutes,
      timeslot_start_hour: timeslot.hour,
      timeslot_start_minute: timeslot.minute,
      timeslot_count: timeslot.count,
      role: 'Volunteer'
    })))
    .select('id');

  if (error) {
    showToast('Failed to create project event', { duration: 5000, isError: true });
    throw error;
  }
}

export default function useCreateTimeslots(
  { projectId }: { projectId: string },
  callback: (err?: Error) => void) {
  return useMutation({
    mutationFn: createTimeslots,
    onSuccess: () => {
      // Invalidate queries to refetch updated data
      void queryClient.invalidateQueries({ queryKey: [projectByIdKey, projectId] });
      showToast('Timeslots created', { duration: 3000 })
      callback();
    },
    onError: (error: Error) => {
      console.error('Error creating timeslot:', error);
      callback(error);
    },
  });
}
