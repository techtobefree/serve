import { useQuery } from "@tanstack/react-query";

import { clientSupabase } from "../persistence/clientSupabase";
import { partialQueryKey as projectByIdKey } from "./queryProjectById";

import { queryClient } from "../persistence/queryClient";

export const partialQueryKey = 'join-projectId-user-id';

export function useJoinProjectByIdQuery(projectId?: string, userId?: string) {
  return useQuery({
    queryKey: [partialQueryKey, projectId, userId],
    enabled: !!projectId && !!userId,
    queryFn: async () => {
      if (!projectId || !userId) {
        return
      }

      const { data: existing } = await clientSupabase
        .from('user_project')
        .select('*')
        .eq('user_id', userId)
        .eq('project_id', projectId)

      if (existing?.length) {
        return existing
      }

      const { data, error } = await clientSupabase
        .from('user_project')
        .insert({ project_id: projectId, created_by: userId, user_id: userId })
        .select('*')

      await queryClient.invalidateQueries({ queryKey: [projectByIdKey, projectId] });


      if (error) {
        throw new Error(error.message);
      }

      return data;
    }
  })
}
