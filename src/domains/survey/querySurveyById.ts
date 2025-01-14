import { useQuery } from "@tanstack/react-query";

import { clientSupabase } from "../persistence/clientSupabase";

export const partialQueryKey = 'get-surveyById';

export function useSurveyByIdQuery(surveyId: string) {
  return useQuery({
    queryKey: [partialQueryKey, surveyId],
    queryFn: async () => {
      const { data, error } = await clientSupabase
        .from('survey')
        .select(`
          *,
          survey_question (
            *,
            survey_question_option (
              *
            ),
            survey_question_hiding_rule (
              *
            )
          )
          `)
        .eq('id', surveyId)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    }
  })
}
