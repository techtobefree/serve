import { IonInput, IonLabel } from "@ionic/react";

import { observer } from "mobx-react-lite";

import {
  QuestionProps,
  ResponseProps,
  surveyStore,
  updateSurveyQuestion
} from "../../../domains/survey/survey";

export default function UrlQuestion({
  index,
  canEdit,
  label,
  question_text
}: QuestionProps) {
  return (
    <IonInput
      disabled={!canEdit}
      label='URL'
      type="text"
      value={question_text || label}
      onIonChange={(event) => {
        updateSurveyQuestion(index, {
          ...surveyStore.current.questions[index],
          question_text: event.target.value as string || ''
        })
      }} />
  );
}

export const UrlResponse = observer(({ question, index }: ResponseProps) => {
  const response = surveyStore.current.responses[index];

  return (
    <div className='border-b-2'>
      <IonLabel
        className={response.question.required ? 'font-bold' : ''}
      >WARNING this is an external link:</IonLabel>
      <div>
        <a className='text-blue-600' href={question.question_text} target="_blank" rel="noreferrer">
          {question.question_text}
        </a>
      </div>
    </div>
  );
})
