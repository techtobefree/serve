import { useQuery } from "@tanstack/react-query";

import { supabase } from "../domains/db/supabaseClient";

export const partialQueryKey = 'get-projectById';

export function useProjectByIdQuery(projectId: string) {
  return useQuery({
    queryKey: [partialQueryKey, projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project')
        .select(`
          *,
          user_project (
            user_id,
            profile (
              user_id,
              handle
            )
          ),
          project_event (
            id,
            project_id,
            project_event_date,
            timezone,
            location,
            location_name,
            project_event_timeslot (
              *
            ),
            project_event_item_ask (
              *
            ),
            project_event_commitment (
              *
            ),
            project_event_item_commitment (
              *
            )
          )
          `)
        .eq('id', projectId)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    }
  })
}
