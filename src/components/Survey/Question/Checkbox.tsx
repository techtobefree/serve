import { IonCheckbox, IonInput, IonLabel } from "@ionic/react";

import { observer } from "mobx-react-lite";

import {
  QuestionProps,
  ResponseProps,
  setResponseText,
  surveyStore,
  updateSurveyQuestion,
} from "../../../domains/survey/survey";

export default function CheckboxQuestion({
  index,
  canEdit,
  question_text,
}: QuestionProps) {
  return (
    <IonInput
      disabled={!canEdit}
      label="Prompt"
      type="text"
      value={question_text}
      onIonChange={(event) => {
        updateSurveyQuestion(index, {
          ...surveyStore.current.questions[index],
          question_text: (event.target.value as string) || "",
        });
      }}
    />
  );
}

export const CheckboxResponse = observer(
  ({ question, index }: ResponseProps) => {
    const response = surveyStore.current.responses[index];

    return (
      <div
        className="border-b-2 flex items-center p-2 gap-2 cursor-pointer"
        onClick={() => {
          console.log("flip");
          setResponseText(index, response.response_text ? undefined : "yes");
        }}
      >
        <IonCheckbox
          checked={response.response_text === "yes" ? true : false}
        />
        <IonLabel className={response.question.required ? "font-bold" : ""}>
          {question.question_text}
          {response.question.required ? "*" : ""}
        </IonLabel>
      </div>
    );
  }
);
