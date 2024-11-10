import { useQuery } from "@tanstack/react-query";
import { supabase } from "../domains/db/supabaseClient";

export function useMyAdminProjectsQuery(userId?: string) {
  return useQuery({
    queryKey: ['my-admin-projects', userId],
    enabled: !!userId,
    queryFn: async () => {
      if (!userId) {
        return
      }
      const { data, error } = await supabase
        .from('project')
        .select('*')
        .eq('admin_id', userId);

      if (error) {
        throw new Error(error.message);
      }

      return data;
    }
  })
}
