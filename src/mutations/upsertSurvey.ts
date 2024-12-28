import { useMutation } from "@tanstack/react-query";

import { clientSupabase } from "../domains/db/clientSupabase";
import { showToast } from "../domains/ui/toast";
import { partialQueryKey as projectByIdKey } from "../queries/projectById";
import { queryClient } from "../queries/queryClient";
import { TableInsert } from "../domains/db/tables";

async function upsertSurvey({
  id,
  userId,
}: {
  id?: string,
  projectId: string,
  userId: string,
  newQuestions: TableInsert['survey_question'][],
  deleteQuestionIds: string[],
}) {
  const { error } = await clientSupabase
    .from('survey')
    .upsert({
      id,
      name: 'Project Survey',
      description: 'Every commitment requires this survey to be filled out',
      created_by: userId,
      owner_id: userId,
    })
    .select('id');

  if (error) {
    showToast('Failed to update survey', { duration: 5000, isError: true });
    throw error;
  }
}

export default function useUpsertSurvey(
  { projectId }: { projectId: string },
  callback?: (err?: Error) => void) {
  return useMutation({
    mutationFn: upsertSurvey,
    onSuccess: () => {
      // Invalidate queries to refetch updated data
      void queryClient.invalidateQueries({ queryKey: [projectByIdKey, projectId] });
      showToast('Survey updated', { duration: 3000 })
      callback?.();
    },
    onError: (error: Error) => {
      console.error('Error updating survey:', error);
      callback?.(error);
    },
  });
}
