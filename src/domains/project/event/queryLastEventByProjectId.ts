import { useQuery } from "@tanstack/react-query";

import { clientSupabase } from "../../persistence/clientSupabase";

export const partialQueryKey = "get-last-event";

export async function queryLastEventByProjectId(projectId: string) {
  const { data, error } = await clientSupabase
    .from("project_event")
    .select(
      `
        *
        `
    )
    .eq("project_id", projectId)
    .order("project_event_date", { ascending: false })
    .limit(1);

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export function useQueryLastEventByProjectId(projectId: string) {
  return useQuery({
    queryKey: [partialQueryKey, projectId],
    queryFn: async () => {
      return queryLastEventByProjectId(projectId);
    },
  });
}
