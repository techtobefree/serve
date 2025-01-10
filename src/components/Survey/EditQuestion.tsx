import {
  IonButton,
  IonCheckbox,
  IonIcon,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption
} from "@ionic/react";

import { trash } from "ionicons/icons";

import {
  InsertSurveyQuestion,
  QUESTION_MAP,
  READ_ONLY_QUESTION_TYPES,
  removeQuestion,
  updateSurveyQuestion
} from "../../domains/survey/survey";



export default function EditQuestion(question: InsertSurveyQuestion & { index: number }) {
  const { id, index, question_type, question_text } = question;
  const QuestionComponent = question_type ? QUESTION_MAP[question_type].question : null;
  const isReadOnly = READ_ONLY_QUESTION_TYPES.includes(question_type as 'url');

  const canEdit = id === undefined;

  return (
    <IonItem className='cursor-auto'>
      <div className='flex flex-col gap-2 w-full'>
        <div className='flex w-full justify-between'>
          <div className="w-30">
            <IonCheckbox
              disabled={isReadOnly}
              onIonChange={event => {
                updateSurveyQuestion(index, { ...question, required: event.target.checked });
              }}
              checked={isReadOnly ? false : question.required}
            ><IonLabel>Required</IonLabel></IonCheckbox>
          </div>
          <div className='w-30'>
            <IonSelect
              disabled={!canEdit}
              aria-label="Prompt type"
              interface="popover"
              placeholder='Type'
              value={question.question_type}
              onIonChange={(event) => {
                updateSurveyQuestion(index, { ...question, question_type: event.target.value });
              }}>
              {(Object.keys(QUESTION_MAP) as Array<keyof typeof QUESTION_MAP>)
                .map((questionType) => (
                  <IonSelectOption
                    key={questionType}
                    value={questionType}
                  >{QUESTION_MAP[questionType].label}</IonSelectOption>
                ))}
            </IonSelect>
          </div>
          <IonButton
            className="w-20"
            color='danger'
            onClick={() => { removeQuestion(index); }}
          ><IonIcon icon={trash} /></IonButton>
        </div>
        {question.deleted &&
          <div className='text-red-500'>Will be deleted</div>
        }
        {
          !question.deleted && (
            question_type && QuestionComponent ?
              <div className='w-full'>
                <QuestionComponent {...{
                  id,
                  index,
                  canEdit,
                  label: QUESTION_MAP[question_type].label,
                  question_type,
                  question_text
                }} />
              </div> : null
          )
        }
      </div>
    </IonItem>
  )
}
