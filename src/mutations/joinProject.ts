import { useMutation } from "@tanstack/react-query";

import { supabase } from "../domains/db/supabaseClient";
import { partialQueryKey as projectByIdKey } from "../queries/projectById";
import { queryClient } from "../queries/queryClient";

export async function joinProject({ projectId, userId }: { projectId: string, userId: string }) {
  await supabase
    .from('user_project')
    .insert({ project_id: projectId, created_by: userId, user_id: userId })
    .select('*')

  await queryClient.invalidateQueries({ queryKey: ['get-projectId', projectId] });
}

export default function useJoinProject(
  { projectId }: { projectId?: string },
  callback?: (err?: Error) => void) {
  return useMutation({
    mutationFn: joinProject,
    onSuccess: () => {
      // Invalidate queries to refetch updated data
      void queryClient.invalidateQueries({ queryKey: [projectByIdKey, projectId] });
      callback?.();
    },
    onError: (error: Error) => {
      console.error('Error creating post:', error);
      callback?.(error);
    },
  });
}
