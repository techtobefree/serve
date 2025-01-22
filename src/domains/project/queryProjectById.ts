import { useQuery } from "@tanstack/react-query";

import { format, subDays } from "date-fns";

import { clientSupabase } from "../persistence/clientSupabase";

export const partialQueryKey = 'get-projectById';

// Only used for the type
export function useTimeslotByIdQuery(eventId: string) {
  return useQuery({
    queryKey: ['get-eventById', eventId],
    queryFn: async () => {
      const { data, error } = await clientSupabase
        .from('project_event_timeslot')
        .select(`
          *
          `)
        .eq('id', eventId)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    }
  })
}

// Only used for the type
export function useEventByIdQuery(eventId: string) {
  return useQuery({
    queryKey: ['get-eventById', eventId],
    queryFn: async () => {
      const { data, error } = await clientSupabase
        .from('project_event')
        .select(`
          *,
          project_event_timeslot (
            *
          ),
          project_event_item_ask (
            *
          ),
          project_event_commitment (
            *,
            profile (
              user_id,
              handle
            )
          ),
          project_event_item_commitment (
            *
          )
          `)
        .eq('id', eventId)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    }
  })
}

// Only used for the type
export function useSurveyQuestionByIdQuery(surveyId: string) {
  return useQuery({
    queryKey: ['get-surveyById', surveyId],
    queryFn: async () => {
      const { data, error } = await clientSupabase
        .from('survey_question')
        .select(`
          *,
          survey_question_option (
            *
          ),
          survey_question_hiding_rule (
            *
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

export function useProjectByIdQuery(projectId: string) {
  return useQuery({
    queryKey: [partialQueryKey, projectId],
    queryFn: async () => {
      const { data, error } = await clientSupabase
        .from('project')
        .select(`
          *,
          user_project (
            user_id,
            profile (
              user_id,
              handle
            )
          ),
          project_event (
            *,
            project_event_timeslot (
              *
            ),
            project_event_item_ask (
              *
            ),
            project_event_commitment (
              *,
              profile (
                user_id,
                handle
              )
            ),
            project_event_item_commitment (
              *
            )
          ),
          project_role (
            *
          ),
          attendee_survey:survey!fk_attendee_survey_id_to_survey_id (
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
          ),
          commitment_survey:survey!fk_commitment_survey_id_to_survey_id (
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
          )
          `)
        .gte('project_event.project_event_date', format(subDays(new Date(), 15), 'yyyy-MM-dd'))
        .filter('survey.survey_question.closed_at', 'is', null)
        .eq('id', projectId)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    }
  })
}
