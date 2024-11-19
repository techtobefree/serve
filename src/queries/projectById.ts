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
          project_day_address(*),
          project_day_timeslot (
            *
          ),
          project_day_item_ask (
            *
          ),
          project_day_commitment (
            *
          ),
          project_day_item_commitment (
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
