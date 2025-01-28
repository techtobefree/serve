import { useMutation } from "@tanstack/react-query";

import { clientSupabase } from "../persistence/clientSupabase";
import { queryClient } from "../persistence/queryClient";
import { TableInsert } from "../persistence/tables";
import { partialQueryKey as projectByIdKey } from "../project/queryProjectById";
import { partialQueryKey as surveyByIdKey } from "../survey/querySurveyById";
import { showToast } from "../ui/toast";

import { InsertSurveyQuestion } from "./survey";

async function ensureSurveyExists({
  column,
  projectId,
  userId,
  surveyId,
}: {
  column: "commitment_survey_id" | "attendee_survey_id";
  projectId: string;
  userId: string;
  surveyId?: string | null;
}) {
  if (surveyId) {
    return surveyId;
  }

  const { data: surveyData, error: surveyError } = await clientSupabase
    .from("survey")
    .upsert({
      id: surveyId === null ? undefined : surveyId,
      name: "Commit to Project",
      description: "The project leader has requested information from you.",
      created_by: userId,
      owner_id: userId,
    })
    .select("id")
    .single();

  if (surveyError) {
    showToast("Failed to update survey", { duration: 5000, isError: true });
    throw surveyError;
  }

  const actualSurveyId = surveyData.id;

  const { error: projectError } = await clientSupabase
    .from("project")
    .update({
      [column]: actualSurveyId,
    })
    .eq("id", projectId)
    .select("*");

  if (projectError) {
    showToast("Failed to update project survey", {
      duration: 5000,
      isError: true,
    });
    throw projectError;
  }

  return actualSurveyId;
}

export function useEnsureSurveyExists(
  { projectId, surveyId }: { projectId: string; surveyId: string | null },
  callback?: (err?: Error, data?: string) => void
) {
  return useMutation({
    mutationFn: ensureSurveyExists,
    onSuccess: (data) => {
      // Invalidate queries to refetch updated data
      if (projectId) {
        void queryClient.invalidateQueries({
          queryKey: [projectByIdKey, projectId],
        });
      }
      if (surveyId) {
        void queryClient.invalidateQueries({
          queryKey: [surveyByIdKey, surveyId],
        });
      }
      callback?.(undefined, data);
    },
    onError: (error: Error) => {
      console.error("Error updating survey:", error);
      callback?.(error);
    },
  });
}

async function upsertProjectSurvey({
  surveyId: maybeSurveyId,
  projectId: maybeProjectId,
  userId,
  questions,
  attendeeSurvey, // If true, then the survey is for attendees, otherwise it is for commitments
}: {
  surveyId?: string; // If ID is provided, then the project already has a survey
  projectId?: string; // If ID is provided, then the project does not have a survey
  userId: string;
  questions: InsertSurveyQuestion[];
  attendeeSurvey?: boolean;
}) {
  if (!maybeProjectId && !maybeSurveyId) {
    throw new Error("Project ID or Survey ID is required");
  }
  let surveyId = maybeSurveyId as string;

  if (!surveyId && maybeProjectId) {
    surveyId = await ensureSurveyExists({
      column: attendeeSurvey ? "attendee_survey_id" : "commitment_survey_id",
      projectId: maybeProjectId,
      userId,
    });
  }

  const questionsToDelete = questions.filter((i) => i.deleted);
  const questionsToUpdate = questions.filter((i) => i.edited && !i.deleted);

  // Close questions that are no longer in use
  try {
    const { error: closedError } = await clientSupabase
      .from("survey_question")
      .update({
        closed_at: new Date().toISOString(),
      })
      .in(
        "id",
        questionsToDelete.map((i) => i.id)
      );

    if (closedError) {
      throw new Error(closedError.message);
    }
  } catch (error) {
    showToast("Failed to close questions", { duration: 5000, isError: true });
    console.log("Failed to close questions:", error);
  }

  // Create/update questions
  for (let index = 0; index < questionsToUpdate.length; index++) {
    const question = questionsToUpdate[index];
    try {
      const { data: surveyQuestion, error: newQuestionsError } =
        await clientSupabase
          .from("survey_question")
          .upsert({
            id: question.id,
            question_order: index,
            question_text: question.question_text,
            question_type: question.question_type,
            required: question.required,
            created_by: userId,
            survey_id: surveyId,
          } as TableInsert["survey_question"])
          .select("id")
          .single();

      if (newQuestionsError) {
        throw new Error(newQuestionsError.message);
      }

      const questionId = surveyQuestion.id;

      if (!questionId) {
        throw new Error("Failed to create new question");
      }

      // Create new question options
      for (const option of question.question_options) {
        try {
          const { error: optionError } = await clientSupabase
            .from("survey_question_option")
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
          showToast("Failed to create question options", {
            duration: 5000,
            isError: true,
          });
          console.log("Failed to create question options", error);
        }
      }

      // Create new question hiding options
      for (const hidingRule of question.question_hiding_rules) {
        try {
          const { error: hidingRuleError } = await clientSupabase
            .from("survey_question_hiding_rule")
            .insert({
              response_survey_question_id:
                hidingRule.response_survey_question_id,
              response_text_indicating_to_hide:
                hidingRule.response_text_indicating_to_hide,
              created_by: userId,
              survey_id: surveyId,
              survey_question_id: questionId,
            });

          if (hidingRuleError) {
            throw new Error(hidingRuleError.message);
          }
        } catch (error) {
          showToast("Failed to create survey hiding rules", {
            duration: 5000,
            isError: true,
          });
          console.log("Failed to create survey hiding rules", error);
        }
      }
    } catch (error) {
      showToast("Failed to create new questions", {
        duration: 5000,
        isError: true,
      });
      console.log("Failed to create new questions", error);
    }
  }
}

export default function useUpsertSurvey(
  { projectId, surveyId }: { projectId?: string; surveyId?: string },
  callback?: (err?: Error) => void
) {
  return useMutation({
    mutationFn: upsertProjectSurvey,
    onSuccess: () => {
      // Invalidate queries to refetch updated data
      if (projectId) {
        void queryClient.invalidateQueries({
          queryKey: [projectByIdKey, projectId],
        });
      }
      if (surveyId) {
        void queryClient.invalidateQueries({
          queryKey: [surveyByIdKey, surveyId],
        });
      }
      showToast("Survey updated", { duration: 3000 });
      callback?.();
    },
    onError: (error: Error) => {
      console.error("Error updating survey:", error);
      callback?.(error);
    },
  });
}
