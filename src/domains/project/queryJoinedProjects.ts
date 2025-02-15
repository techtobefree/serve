import { useQuery } from "@tanstack/react-query";

import { clientSupabase } from "../persistence/clientSupabase";

export function useMyJoinedProjectsQuery(userId?: string) {
  return useQuery({
    queryKey: ["my-joined-projects", userId],
    enabled: !!userId,
    queryFn: async () => {
      if (!userId) {
        return {};
      }
      const { data, error } = await clientSupabase
        .from("user_project")
        .select("*")
        .eq("user_id", userId);

      if (error) {
        console.log(new Error(error.message))
        return {}
      }

      return data.reduce(
        (acc: { [projectId: string]: boolean }, { project_id }) => {
          acc[project_id] = true;
          return acc;
        },
        {}
      );
    },
  });
}
