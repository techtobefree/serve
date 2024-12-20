import { useQuery } from "@tanstack/react-query";

import { clientSupabase } from "../domains/db/clientSupabase";

export const partialQueryKey = 'get-projectById';

// Only used for the type
export function useTimeslotByIdQuery(eventId: string) {
  return useQuery({
    queryKey: ['get-eventById', eventId],
    queryFn: async () => {
      const { data, error } = await clientSupabase
        .from('project_event_timeslot')
        .select(`
          *
          `)
        .eq('id', eventId)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    }
  })
}

// Only used for the type
export function useEventByIdQuery(eventId: string) {
  return useQuery({
    queryKey: ['get-eventById', eventId],
    queryFn: async () => {
      const { data, error } = await clientSupabase
        .from('project_event')
        .select(`
          *,
          project_event_timeslot (
            *
          ),
          project_event_item_ask (
            *
          ),
          project_event_commitment (
            *,
            profile (
              user_id,
              handle
            )
          ),
          project_event_item_commitment (
            *
          )
          `)
        .eq('id', eventId)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    }
  })
}


export function useProjectByIdQuery(projectId: string) {
  return useQuery({
    queryKey: [partialQueryKey, projectId],
    queryFn: async () => {
      const { data, error } = await clientSupabase
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
            *,
            project_event_timeslot (
              *
            ),
            project_event_item_ask (
              *
            ),
            project_event_commitment (
              *,
            profile (
              user_id,
              handle
            )
            ),
            project_event_item_commitment (
              *
            )
          ),
          project_role (
            *
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
