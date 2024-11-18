import { useMutation } from "@tanstack/react-query";

import { supabase } from "../domains/db/supabaseClient";
import { queryClient } from "../queries/queryClient";

async function newProjectDay(
  projectId: string,
  userId: string,
  date: string,
  timezone: string,
  location: { lat: number, lng: number },
) {
  const { error } = await supabase
    .schema('gis')
    .from('project_day')
    .insert({
      project_id: projectId,
      project_day_date: date,
      created_by: userId,
      timezone,
      location: `POINT(${location.lng.toString()} ${location.lat.toString()})`,
    });
  if (error) {
    alert('Failed to create project day');
  }
}


export default function useCreateEvent({ projectId }: { projectId: string }) {
  return useMutation(newProjectDay, {
    onSuccess: () => {
      // Invalidate queries to refetch updated data
      void queryClient.invalidateQueries({ queryKey: ['get-projectId', projectId] });
    },
    onError: (error) => {
      console.error('Error creating post:', error);
    },
  });
}
