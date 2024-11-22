import { useMutation } from "@tanstack/react-query";

import { supabase } from "../domains/db/supabaseClient";
import { partialQueryKey as projectByIdKey } from "../queries/projectById";
import { queryClient } from "../queries/queryClient";

export async function leaveProject({ projectId, userId }: { projectId: string, userId: string }) {
  await supabase
    .from('user_project')
    .delete()
    .eq('user_id', userId)
    .eq('project_id', projectId);

  await queryClient.invalidateQueries({ queryKey: ['get-projectId', projectId] });
}

export default function useLeaveProject(
  { projectId }: { projectId?: string },
  callback?: (err?: Error) => void) {
  return useMutation({
    mutationFn: leaveProject,
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
