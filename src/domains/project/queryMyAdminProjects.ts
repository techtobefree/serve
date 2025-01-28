import { useQuery } from "@tanstack/react-query";

import { clientSupabase } from "../persistence/clientSupabase";

export function useMyAdminProjectsQuery(userId?: string) {
  return useQuery({
    queryKey: ["my-admin-projects", userId],
    enabled: !!userId,
    queryFn: async () => {
      if (!userId) {
        return;
      }
      const { data, error } = await clientSupabase
        .from("project")
        .select("*")
        .eq("owner_id", userId);

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
  });
}
