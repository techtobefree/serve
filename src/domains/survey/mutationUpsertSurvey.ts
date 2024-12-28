import { useMutation } from "@tanstack/react-query";

import { clientSupabase } from "../persistence/clientSupabase";
import { showToast } from "../ui/toast";
import { partialQueryKey as projectByIdKey } from "../project/queryProjectById";
import { queryClient } from "../persistence/queryClient";
import { TableInsert } from "../persistence/tables";

async function upsertSurvey({
  id,
  projectId,
  userId,
}: {
  id?: string,
  projectId: string,
  userId: string,
  newQuestions: TableInsert['survey_question'][],
  deleteQuestionIds: string[],
}) {
  const { data: surveyData, error: surveyError } = await clientSupabase
    .from('survey')
    .upsert({
      id,
      name: 'Project Survey',
      description: 'Every commitment requires this survey to be filled out',
      created_by: userId,
      owner_id: userId,
    })
    .select('id');

  if (surveyError) {
    showToast('Failed to update survey', { duration: 5000, isError: true });
    throw surveyError;
  }

  const surveyId = surveyData?.[0]?.id;

  const { error: projectError } = await clientSupabase
    .from('project')
    .update({
      commitment_survey_id: surveyId,
    })
    .eq('id', projectId)
    .select('id');

  if (projectError) {
    showToast('Failed to update project survey', { duration: 5000, isError: true });
    throw projectError;
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
