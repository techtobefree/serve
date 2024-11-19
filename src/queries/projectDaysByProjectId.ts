import { useQuery } from "@tanstack/react-query";

import { supabase } from "../domains/db/supabaseClient";

export const partialQueryKey = 'get-projectDaysById';

export function useProjectDaysByProjectIdQuery(projectId: string) {
  return useQuery({
    queryKey: [partialQueryKey, projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .schema('gis')
        .from('project_day')
        .select(`
          *
        `)
        .eq('project_id', projectId)

      if (error) {
        throw new Error(error.message);
      }

      return data;
    }
  })
}
