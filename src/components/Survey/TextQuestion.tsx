import { IonInput } from "@ionic/react";
import { QuestionProps } from "./QuestionProps";
import { surveyStore, updateSurveyQuestion } from "../../domains/survey/survey";

export default function TextQuestion({ index, canEdit, question_text, question_type }: QuestionProps) {
  return (
    <IonInput disabled={!canEdit} label='Prompt' type="text" value={question_text} onIonChange={(event) => {
      updateSurveyQuestion(index, { ...surveyStore.current.questions[index], question_text: (event.target.value || '') as string })
    }} />
  );
}
