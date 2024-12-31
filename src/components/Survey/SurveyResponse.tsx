import { observer } from "mobx-react-lite";
import { InsertResponse, resetSurveyStoreResponse, surveyStore } from "../../domains/survey/survey";
import { useEffect, useMemo } from "react";
import { useSurveyByIdQuery } from "../../domains/project/queryProjectById";
import { IonButton } from "@ionic/react";
import { TextResponse } from "./TextQuestion";
import { toJS } from "mobx";
import { showToast } from "../../domains/ui/toast";

type Props = {
  survey: ReturnType<typeof useSurveyByIdQuery>['data'] | null;
  responses: InsertResponse[];
  onComplete: () => void;
}

function isValidResponse(responses: InsertResponse[]) {
  const missingResponse = responses.find((response) => response.question.required && !response.response_text);
  if (missingResponse) {
    showToast(`${missingResponse.question.question_text} is required`, { duration: 5000, isError: true });
    return false;
  }

  return true;
}

export function SurveyResponseComponent({ survey, responses, onComplete }: Props) {
  return (
    <div className='flex flex-col gap-6 p-4 overflow-auto'>
      <div className='text-2xl'>{survey?.name}</div>
      <div>{survey?.description}</div>
      <div className='flex flex-col gap-4'>
        {responses.map((response, index) => (
          <div key={index}>
            <TextResponse label={response.question.question_text || 'Missing label'} index={index} />
          </div>
        ))}
      </div>
      <div>
        <div className='flex justify-end'>
          <IonButton
            color='danger'
            onClick={() => {
              onComplete();
            }}>
            Cancel
          </IonButton>
          <IonButton
            onClick={() => {
              if (isValidResponse(responses)) {
                console.log('TODO Submit response', toJS(surveyStore.current.responses));
                onComplete();
              }
            }}>
            Submit
          </IonButton>
        </div>
      </div>
    </div>
  );
}

const SurveyResponse = observer(({ onComplete, survey }: Omit<Props, 'responses' | 'surveyMap'>) => {
  const surveyMap = useMemo(() => {
    const map = new Map();
    survey?.survey_question.forEach((question) => {
      map.set(question.id, question)
    })
    return map;
  }, [survey])

  useEffect(() => {
    const responses: InsertResponse[] = [];
    survey?.survey_question.forEach((question) => {
      responses.push({
        survey_id: question.survey_id,
        survey_question_id: question.id,
        response_text: '',
        question_type: question.question_type,
        question: surveyMap.get(question.id),
      })
    })

    resetSurveyStoreResponse(responses)
  }, [survey])

  return <SurveyResponseComponent
    survey={survey}
    responses={[...surveyStore.current.responses.map(i => ({ ...i, response_text: i.response_text }))]}
    onComplete={onComplete}
  />
})

export default SurveyResponse;
