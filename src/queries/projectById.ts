import { useQuery } from "@tanstack/react-query";

import { supabase } from "../domains/db/supabaseClient";

export function useProjectByIdQuery(projectId: string) {
  return useQuery({
    queryKey: ['get-projectId', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project')
        .select(`
          *,
          user_project (
            user_id,
            profile (
              user_id
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
