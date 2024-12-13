import { useQuery } from "@tanstack/react-query";

import { clientSupabase } from "../domains/db/clientSupabase";

export function useAllProjectsQuery() {
  return useQuery({
    queryKey: ['all-projects'],
    queryFn: async () => {
      const { data, error } = await clientSupabase
        .from('project')
        .select('*')
        .eq('published', true);

      if (error) {
        throw new Error(error.message);
      }

      return data;
    }
  })
}
