import { supabase } from "../domains/db/supabaseClient";
import { queryClient } from "../queries/queryClient";

export async function leaveProject(projectId: string, userId: string) {
  await supabase
    .from('user_project')
    .delete()
    .eq('user_id', userId)
    .eq('project_id', projectId);

  await queryClient.invalidateQueries({ queryKey: ['get-projectId', projectId] });
}
