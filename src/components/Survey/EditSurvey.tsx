import { IonButton, IonIcon } from "@ionic/react"

import { add } from "ionicons/icons"

import { observer } from "mobx-react-lite"
import { useEffect } from "react"

import { useSurveyByIdQuery } from "../../domains/project/queryProjectById"

import {
  addQuestionToSurvey,
  InsertSurveyQuestion,
  QUESTION_TYPE,
  resetSurveyStoreQuestions,
  surveyStore
} from "../../domains/survey/survey"


import EditQuestion from "./EditQuestion"

type Props = {
  survey: ReturnType<typeof useSurveyByIdQuery>['data'] | null,
  surveyQuestions: InsertSurveyQuestion[],
}

export function EditSurveyComponent({ survey, surveyQuestions }: Props) {
  useEffect(() => {
    const questions: InsertSurveyQuestion[] = [];
    survey?.survey_question.forEach((question) => {
      questions.push({
        id: question.id,
        question_text: question.question_text,
        question_type: question.question_type as keyof typeof QUESTION_TYPE,
        question_options: question.survey_question_option.map((option) => ({
          option_text: option.option_text,
        })),
        required: question.required,
        question_hiding_rules: question.survey_question_hiding_rule.map((rule) => ({
          response_survey_question_id: rule.response_survey_question_id,
          response_text_indicating_to_hide: rule.response_text_indicating_to_hide,
        })),
      })
    })

    resetSurveyStoreQuestions(questions)
  }, [survey])

  return (
    <div>
      <div className='flex flex-col justify-center'>
        {surveyQuestions.map((question, index) => (
          <EditQuestion key={index} index={index} {...question} />
        ))}
        <IonButton onClick={() => {
          addQuestionToSurvey({
            question_type: QUESTION_TYPE.text,
            question_text: 'Favorite color',
            required: false,
            question_hiding_rules: [],
            question_options: [],
          })
        }}><IonIcon icon={add} /></IonButton>
      </div>
    </div>
  )
}

const EditSurvey = observer(({ survey }: Omit<Props, 'surveyQuestions'>) => {
  return <EditSurveyComponent
    survey={survey}
    surveyQuestions={[...surveyStore.current.questions.map(i => ({ ...i, deleted: i.deleted }))]}
  />
})

export default EditSurvey;
