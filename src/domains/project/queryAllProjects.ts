import { useQuery } from "@tanstack/react-query";

import { clientSupabase } from "../persistence/clientSupabase";

export const partialQueryKey = "all-projects";

export function useAllProjectsQuery() {
  return useQuery({
    queryKey: [partialQueryKey],
    queryFn: async () => {
      const { data, error } = await clientSupabase
        .from("project")
        .select("*")
        .eq("published", true);

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
  });
}
