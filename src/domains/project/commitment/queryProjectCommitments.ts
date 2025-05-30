import { useQuery } from "@tanstack/react-query";

import { clientSupabase } from "../../persistence/clientSupabase";

export const partialQueryKey = "get-project-commitments";

export function useQueryProjectCommitments(
  projectId: string,
  projectEventId: string,
  enabled: boolean = true
) {
  return useQuery({
    queryKey: [partialQueryKey, projectId, projectEventId],
    enabled,
    queryFn: async () => {
      const { data, error } = await clientSupabase
        .from("project_event_commitment")
        .select(
          `
          *,
          profile (
            user_id,
            handle
          )
          `
        )
        .eq("project_id", projectId)
        .eq("project_event_id", projectEventId);

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
  });
}
