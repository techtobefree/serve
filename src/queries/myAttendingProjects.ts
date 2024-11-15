import { useQuery } from "@tanstack/react-query";

import { supabase } from "../domains/db/supabaseClient";

export function useMyAttendingProjectsQuery(userId?: string) {
  return useQuery({
    queryKey: ['my-attending-projects', userId],
    enabled: !!userId,
    queryFn: async () => {
      if (!userId) {
        return
      }
      const { data, error } = await supabase
        .from('project')
        .select(`
        *,
        user_project!inner (
          user_id
        )
      `)
        .eq('user_project.user_id', userId)
        .neq('owner_id', userId);

      if (error) {
        throw new Error(error.message);
      }

      return data;
    }
  })
}
