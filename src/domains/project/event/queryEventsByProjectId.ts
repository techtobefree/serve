import { useQuery } from "@tanstack/react-query";

import { format, subDays } from "date-fns";

import { clientSupabase } from "../../persistence/clientSupabase";

export const partialQueryKey = "get-past-events";

export function useQueryEventsByProjectId(projectId: string, enabled: boolean) {
  return useQuery({
    queryKey: [partialQueryKey, projectId],
    enabled,
    queryFn: async () => {
      const { data, error } = await clientSupabase
        .from("project_event")
        .select(
          `
          *,
            project_event_commitment (
              *,
              profile (
                user_id,
                handle
              )
            )
          `
        )
        .lt("project_event_date", format(subDays(new Date(), 5), "yyyy-MM-dd"))
        .eq("project_id", projectId);

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
  });
}
