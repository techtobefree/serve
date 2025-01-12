import { IonInput, IonLabel } from "@ionic/react";

import { observer } from "mobx-react-lite";

import { useEffect } from "react";

import { userStore } from "../../../domains/auth/sessionStore";
import { useProfileQuery } from "../../../domains/profile/queryProfileByUserId";
import {
  QUESTION_TYPE,
  QuestionProps,
  ResponseProps,
  setResponseText,
  surveyStore,
  updateSurveyQuestion
} from "../../../domains/survey/survey";

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

export const TextResponse = observer(({ question, index }: ResponseProps) => {
  const { data: profile } = useProfileQuery(userStore.current?.id);

  useEffect(() => {
    if (profile?.sensitive_profile[0].first_name &&
      question.question_type === QUESTION_TYPE.first_name) {
      setResponseText(index, profile.sensitive_profile[0].first_name);
    }
    if (profile?.sensitive_profile[0].last_name &&
      question.question_type === QUESTION_TYPE.last_name) {
      setResponseText(index, profile.sensitive_profile[0].last_name);
    }
    if (profile?.sensitive_profile[0].email &&
      question.question_type === QUESTION_TYPE.email) {
      setResponseText(index, profile.sensitive_profile[0].email);
    }
    if (profile?.sensitive_profile[0].phone &&
      question.question_type === QUESTION_TYPE.phone) {
      setResponseText(index, profile.sensitive_profile[0].phone);
    }
  }, [question.question_type, index, profile]);

  const response = surveyStore.current.responses[index];

  return (
    <div className='border-b-2'>
      <IonLabel
        className={response.question.required ? 'font-bold' : ''}
      >{question.question_text}{response.question.required ? '*' : ''}</IonLabel>
      <IonInput
        onIonChange={(event) => { setResponseText(index, event.target.value as string || ''); }}
        value={response.response_text}
      />
    </div>
  );
})
