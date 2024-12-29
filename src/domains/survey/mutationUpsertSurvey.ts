import { useMutation } from "@tanstack/react-query";

import { clientSupabase } from "../persistence/clientSupabase";
import { showToast } from "../ui/toast";
import { partialQueryKey as projectByIdKey } from "../project/queryProjectById";
import { queryClient } from "../persistence/queryClient";
import { InsertSurveyQuestion } from "./survey";

async function ensureSurveyExists({ projectId, userId, surveyId }:
  { projectId: string, userId: string, surveyId?: string }) {

  if (surveyId) {
    return surveyId;
  }

  const { data: surveyData, error: surveyError } = await clientSupabase
    .from('survey')
    .upsert({
      id: surveyId,
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

  const actualSurveyId = surveyData?.[0]?.id;

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

  return actualSurveyId;
}

async function upsertProjectSurvey({
  surveyId: maybeSurveyId,
  projectId,
  userId,
  newQuestions,
  questionIdsToClose,
}: {
  surveyId?: string, // If ID is provided, then the project already has a survey
  projectId: string,
  userId: string,
  newQuestions: InsertSurveyQuestion[],
  questionIdsToClose: string[],
}) {
  const surveyId = await ensureSurveyExists({ projectId, userId, surveyId: maybeSurveyId });

  // Close questions that are no longer in use
  try {
    const { error: closedError } = await clientSupabase
      .from('survey_question')
      .update({
        closed_at: new Date().toISOString(),
      })
      .in('id', questionIdsToClose);

    if (closedError) {
      throw new Error(closedError.message);
    }
  } catch (error) {
    showToast('Failed to close questions', { duration: 5000, isError: true });
  }

  // Create new questions
  for (const question of newQuestions) {
    try {
      const { data: surveyQuestion, error: newQuestionsError } = await clientSupabase
        .from('survey_question')
        .insert({
          question_order: question.question_order,
          question_text: question.question_text,
          question_type: question.question_type,
          required: question.required,
          created_by: userId,
          survey_id: surveyId,
        })
        .select('id');

      if (newQuestionsError) {
        throw new Error(newQuestionsError.message);
      }

      const questionId = surveyQuestion?.[0]?.id;

      if (!questionId) {
        throw new Error('Failed to create new question');
      }

      // Create new question options
      if (question.question_options) {
        for (const option of question.question_options) {
          try {
            const { error: optionError } = await clientSupabase
              .from('survey_question_option')
              .insert({
                option_text: option.option_text,
                created_by: userId,
                survey_id: surveyId,
                survey_question_id: questionId,
              });

            if (optionError) {
              throw new Error(optionError.message);
            }
          } catch (error) {
            showToast('Failed to create question options', { duration: 5000, isError: true });
          }
        }
      }

      // Create new question hiding options
      if (question.question_hiding_rules) {
        for (const hidingRule of question.question_hiding_rules) {
          try {
            const { error: hidingRuleError } = await clientSupabase
              .from('survey_question_hiding_rule')
              .insert({
                response_survey_question_id: hidingRule.response_survey_question_id,
                response_text_indicating_to_hide: hidingRule.response_text_indicating_to_hide,
                created_by: userId,
                survey_id: surveyId,
                survey_question_id: questionId,
              });

            if (hidingRuleError) {
              throw new Error(hidingRuleError.message);
            }
          } catch (error) {
            showToast('Failed to create survey hiding rules', { duration: 5000, isError: true });
          }
        }
      }

    } catch (error) {
      showToast('Failed to create new questions', { duration: 5000, isError: true });
    }
  }
}

export default function useUpsertProjectSurvey(
  { projectId }: { projectId: string },
  callback?: (err?: Error) => void) {
  return useMutation({
    mutationFn: upsertProjectSurvey,
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
