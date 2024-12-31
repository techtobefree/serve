import { useMutation } from "@tanstack/react-query";

import { clientSupabase } from "../persistence/clientSupabase";
import { showToast } from "../ui/toast";
import { partialQueryKey as projectByIdKey } from "../project/queryProjectById";
import { queryClient } from "../persistence/queryClient";
import { InsertResponse } from "./survey";
import { TableInsert } from "../persistence/tables";

async function answerSurvey({
  userId,
  responses,
}: {
  userId: string,
  responses: InsertResponse[],
}) {
  try {
    const response_records = responses
      .filter(i => i.response_text)
      .map((response) => ({
        survey_id: response.survey_id,
        survey_question_id: response.survey_question_id,
        response_text: response.response_text,
        created_by: userId,
        question_type: response.question.question_type,
      } as TableInsert['survey_response']));
    const { error: closedError } = await clientSupabase
      .from('survey_response')
      .insert(response_records);

    if (closedError) {
      throw new Error(closedError.message);
    }
  } catch (error) {
    showToast('Failed to complete survey', { duration: 5000, isError: true });
  }
}

export default function useAnswerSurvey(
  { projectId }: { projectId: string },
  callback?: (err?: Error) => void) {
  return useMutation({
    mutationFn: answerSurvey,
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
