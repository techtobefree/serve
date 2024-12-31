import { IonInput, IonLabel } from "@ionic/react";
import { QuestionProps } from "./QuestionProps";
import { setResponseText, surveyStore, updateSurveyQuestion } from "../../domains/survey/survey";
import { observer } from "mobx-react-lite";

export default function TextQuestion({ index, canEdit, question_text }: QuestionProps) {
  return (
    <IonInput disabled={!canEdit} label='Prompt' type="text" value={question_text} onIonChange={(event) => {
      updateSurveyQuestion(index, { ...surveyStore.current.questions[index], question_text: event.target.value as string || '' })
    }} />
  );
}

export const TextResponse = observer(({ label, index }: { label: string, index: number }) => {
  const response = surveyStore.current.responses[index];

  return (
    <div className='border-b-2'>
      <IonLabel className={`whitespace-nowrap ${response.question.required ? 'font-bold' : ''}`}>{label}{response.question.required ? '*' : ''}</IonLabel>
      <IonInput
        onIonChange={(event) => setResponseText(index, event.target.value as string || '')}
        value={response.response_text}
      />
    </div>
  );
})
