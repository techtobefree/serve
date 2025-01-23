// Sorry - I was tired
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { TZDate } from "@date-fns/tz";
import { useQuery } from "@tanstack/react-query";

import { format } from "date-fns";

import { downloadTextFile } from '../../file';
import { jsonToCsv } from '../../file/jsonToCsv';
import { clientSupabase } from "../../persistence/clientSupabase";
import { showToast } from "../../ui/toast";
import { useEventByIdQuery } from "../queryProjectById";


export const partialQueryKey = 'project-commitment';

export function useProjectCommitmentDownloadQuery({
  shouldDownload,
  onComplete,
  event,
  projectEventId,
  attendeeSurveyId,
  commitmentSurveyId,
}: {
  event: Exclude<ReturnType<typeof useEventByIdQuery>['data'], undefined>,
  onComplete: () => void,
  projectEventId?: string,
  shouldDownload: boolean,
  attendeeSurveyId?: string | null,
  commitmentSurveyId?: string | null,
}) {
  return useQuery({
    queryKey: [partialQueryKey, projectEventId],
    enabled: shouldDownload && !!projectEventId,
    queryFn: async () => {
      try {
        if (!projectEventId || (!attendeeSurveyId && !commitmentSurveyId)) {
          showToast('Missing project event ID or survey ID', { duration: 5000, isError: true });
          throw new Error('Missing projectEventId or surveyId');
        }
        const { data: surveys, error: surveyError } = await clientSupabase
          .from('survey')
          .select(`
            *,
            survey_question (
              *
            )
          `)
          .in('id', [attendeeSurveyId, commitmentSurveyId].filter(i => !!i));

        if (surveyError) {
          showToast('Error getting survey', { duration: 5000, isError: true });
          throw new Error(surveyError.message);
        }

        const { data: responses, error: answerError } = await clientSupabase
          .from('survey_response')
          .select(`
            *
          `)
          .in('survey_id', [attendeeSurveyId, commitmentSurveyId].filter(i => !!i))

        if (answerError) {
          showToast('Error getting survey', { duration: 5000, isError: true });
          throw new Error(answerError.message);
        }

        const { data: db_commitments, error } = await clientSupabase
          .from('project_event_commitment')
          .select(`
            *,
            profile (
              handle
            )
          `)
          .eq('project_event_id', projectEventId)

        if (error) {
          showToast('Error getting commitments', { duration: 5000, isError: true });
          throw new Error(error.message);
        }

        if (!db_commitments.length) {
          showToast('No commitments found', { duration: 5000, isError: true });
          throw new Error('No commitments found');
        }

        const questionMap = new Map();
        surveys.forEach(survey => {
          survey.survey_question.forEach((question: any) => {
            questionMap.set(question.id, question);
          })
        })

        const compositeMap = new Map();
        db_commitments.forEach((commitment: any) => {
          compositeMap.set(commitment.created_by, { commitment, responses: {} });
        })

        responses.forEach((response: any) => {
          try {
            const composite = compositeMap.get(response.created_by);
            composite.responses[response.survey_question_id] = response.response_text;
          } catch (err) {
            console.log('Error mapping response', err)
            showToast(`Error mapping response questionID: ${response.survey_question_id as string}`,
              { duration: 5000, isError: true })
          }
        })

        const commitments = db_commitments.map((item: any) => {
          const CommitmentStart = new TZDate(item.commitment_start).withTimeZone(event.timezone);
          const CommitmentEnd = new TZDate(item.commitment_end).withTimeZone(event.timezone);

          const row: any = {
            StartTime: format(CommitmentStart, 'HH:mm z'),
            Hours: (CommitmentEnd.getTime() - CommitmentStart.getTime()) / 1000 / 60 / 60,
            CommitmentStart: CommitmentStart.toString(),
            CommitmentEnd: CommitmentEnd.toString(),
            Role: item.role,
            Handle: item.profile.handle,
          }

          Object.entries(compositeMap.get(item.created_by).responses).forEach(([questionId, response]) => {
            try {
              const question = questionMap.get(questionId);
              row[question.question_text] = response;
            } catch (err) {
              console.log('Error mapping question', err)
              showToast(`Error mapping questionID: ${questionId}`,
                { duration: 5000, isError: true })
            }
          })

          return row;
        })

        downloadTextFile(`project_commitments_${event.project_event_date}.csv`, jsonToCsv(commitments))

      } catch (e: any) {
        console.error('Error creating commitment report:', e);
        showToast(`Error creating commitment report. ${e.message as string}`, { duration: 5000, isError: true });
      }
      onComplete()

      return []
    }
  })
}
