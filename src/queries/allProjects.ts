import { useQuery } from "@tanstack/react-query";

import { supabase } from "../domains/db/supabaseClient";

export function useAllProjectsQuery() {
  return useQuery({
    queryKey: ['all-projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project')
        .select('*')
        .eq('unlisted', false);

      if (error) {
        throw new Error(error.message);
      }

      return data;
    }
  })
}
