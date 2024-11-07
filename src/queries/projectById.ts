import { useQuery } from "@tanstack/react-query";
import { supabase } from "../domains/db/supabaseClient";

export function useProjectByIdQuery(projectId: string) {
  return useQuery({
    queryKey: ['projectId', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project')
        .select('*')
        .eq('id', projectId)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    }
  })
}
