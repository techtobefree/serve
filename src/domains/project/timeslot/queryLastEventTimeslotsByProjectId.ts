import { useQuery } from "@tanstack/react-query";

import { clientSupabase } from "../../persistence/clientSupabase";
import { queryLastEventByProjectId } from "../event/queryLastEventByProjectId";

export const partialQueryKey = "get-last-asks";

export function useQueryLastEventTimeslotsByProjectId(projectId: string) {
  return useQuery({
    queryKey: [partialQueryKey, projectId],
    queryFn: async () => {
      const lastEvents = await queryLastEventByProjectId(projectId);

      if (!lastEvents[0]) {
        return [];
      }

      const lastEvent = lastEvents[0];

      const { data, error } = await clientSupabase
        .from("project_event_timeslot")
        .select(
          `
          *
          `
        )
        .eq("project_event_id", lastEvent.id);

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
  });
}
