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
  QUESTION_TYPE,
  removeQuestion,
  updateSurveyQuestion
} from "../../domains/survey/survey";

import { QuestionProps } from "./QuestionProps";
import TextQuestion from "./TextQuestion";

const QUESTION_MAP: {
  [key in keyof typeof QUESTION_TYPE]:
  { label: string, component: (props: QuestionProps) => React.JSX.Element };
} = {
  text: { label: 'Text', component: TextQuestion },
  long_text: { label: 'Long Text', component: TextQuestion },
  first_name: { label: 'First Name', component: TextQuestion },
  last_name: { label: 'Last Name', component: TextQuestion },
  email: { label: 'Email', component: TextQuestion },
  phone: { label: 'Phone', component: TextQuestion },
  street: { label: 'Street', component: TextQuestion },
  city: { label: 'City', component: TextQuestion },
  state: { label: 'State', component: TextQuestion },
  postal_code: { label: 'Postal Code', component: TextQuestion },
  country: { label: 'Country', component: TextQuestion },
}

export default function EditQuestion(question: InsertSurveyQuestion & { index: number }) {
  const { id, index, question_type, question_text } = question;

  const canEdit = id === undefined;

  return (
    <IonItem className='cursor-auto'>
      <div className='flex flex-col gap-2 w-full'>
        <div className='flex w-full justify-between'>
          <div className="w-30">
            <IonCheckbox
              onIonChange={event => {
                updateSurveyQuestion(index, { ...question, required: event.target.checked });
              }}
              checked={question.required}
            ><IonLabel>Required</IonLabel></IonCheckbox>
          </div>
          <div className='w-30'>
            <IonSelect
              disabled={!canEdit}
              aria-label="Prompt type"
              interface="popover"
              placeholder='Type'
              defaultValue={undefined}
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
        {
          question.deleted ?
            <div className='text-red-500'>Will be deleted</div> :
            <div className='w-full'>
              {
                QUESTION_MAP[question_type]
                  .component({
                    id,
                    index,
                    canEdit,
                    label: QUESTION_MAP[question_type].label, question_type, question_text
                  })
              }
            </div>
        }
      </div>
    </IonItem>
  )
}
