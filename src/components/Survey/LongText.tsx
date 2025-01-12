import { IonInput, IonLabel, IonTextarea } from "@ionic/react";

import { observer } from "mobx-react-lite";

import {
  ResponseProps,
  setResponseText,
  surveyStore,
  updateSurveyQuestion
} from "../../domains/survey/survey";

import { QuestionProps } from "./QuestionProps";

export default function LongTextQuestion({
  index,
  canEdit,
  label,
  question_text
}: QuestionProps) {
  return (
    <IonInput
      disabled={!canEdit}
      label='Prompt'
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

export const LongTextResponse = observer(({ question, index }: ResponseProps) => {
  const response = surveyStore.current.responses[index];

  return (
    <div className='border-b-2'>
      <IonLabel
        className={response.question.required ? 'font-bold' : ''}
      >{question.question_text}{response.question.required ? '*' : ''}</IonLabel>
      <IonTextarea
        onIonChange={(event) => { setResponseText(index, event.target.value as string || ''); }}
        value={response.response_text}
      />
    </div>
  );
})
