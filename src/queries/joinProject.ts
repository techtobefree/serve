import { useQuery } from "@tanstack/react-query";
import { supabase } from "../domains/db/supabaseClient";

export function useJoinProjectByIdQuery(projectId?: string, userId?: string) {
  return useQuery({
    queryKey: ['join-projectId-user-id', projectId, userId],
    enabled: !!projectId && !!userId,
    queryFn: async () => {
      if (!projectId || !userId) {
        return
      }

      const { data: existing } = await supabase
        .from('user_project')
        .select('*')
        .eq('user_id', userId)
        .eq('project_id', projectId)

      if (existing?.length) {
        return existing
      }

      const { data, error } = await supabase
        .from('user_project')
        .insert({ project_id: projectId, created_by: userId, user_id: userId })
        .select('*')

      if (error) {
        throw new Error(error.message);
      }

      return data;
    }
  })
}
