import { IonCheckbox, IonInput, IonLabel } from "@ionic/react";

import { observer } from "mobx-react-lite";

import {
  ResponseProps,
  setResponseText,
  surveyStore,
  updateSurveyQuestion
} from "../../domains/survey/survey";

import { QuestionProps } from "./QuestionProps";

export default function CheckboxQuestion({
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

export const CheckboxResponse = observer(({ question, index }: ResponseProps) => {
  const response = surveyStore.current.responses[index];
  console.log('response.response_text', response.response_text)

  return (
    <div className='border-b-2 flex items-center p-2 gap-2 cursor-pointer' onClick={() => {
      console.log('flip')
      setResponseText(index, response.response_text ? undefined : 'yes');
    }}>
      <IonCheckbox
        checked={response.response_text === 'yes' ? true : false}
      />
      <IonLabel
        className={`whitespace-nowrap ${response.question.required ? 'font-bold' : ''}`}
      >{question.question_text}{response.question.required ? '*' : ''}</IonLabel>
    </div>
  );
})
