import { IonInput, IonLabel } from "@ionic/react";

import { observer } from "mobx-react-lite";

import { setResponseText, surveyStore, updateSurveyQuestion } from "../../domains/survey/survey";

import { QuestionProps } from "./QuestionProps";

export default function TextQuestion({
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

export const TextResponse = observer(({ label, index }: { label: string, index: number }) => {
  const response = surveyStore.current.responses[index];

  return (
    <div className='border-b-2'>
      <IonLabel
        className={`whitespace-nowrap ${response.question.required ? 'font-bold' : ''}`}
      >{label}{response.question.required ? '*' : ''}</IonLabel>
      <IonInput
        onIonChange={(event) => { setResponseText(index, event.target.value as string || ''); }}
        value={response.response_text}
      />
    </div>
  );
})
