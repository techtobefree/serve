import { IonButton, IonIcon } from "@ionic/react"
import { useSurveyByIdQuery } from "../../domains/project/queryProjectById"
import { add } from "ionicons/icons"
import { useEffect } from "react"
import { InsertSurveyQuestion, syncSurveyStore } from "../../domains/survey/survey"

type Props = {
  survey: ReturnType<typeof useSurveyByIdQuery>['data'] | null,
}

export default function EditSurvey({ survey }: Props) {
  useEffect(() => {
    const questions: InsertSurveyQuestion[] = [];
    survey?.survey_question.forEach((question) => {
      questions.push({
        question_text: question.question_text,
        question_type: question.question_type,
        question_order: question.question_order,
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

    syncSurveyStore(questions)
  }, [survey])

  return (
    <div>
      <div className='flex justify-center'>
        <IonButton onClick={() => { }}><IonIcon icon={add} /></IonButton>
      </div>
    </div>
  )
}

// newQuestions.push({
//     question_type: 'text',
//     question_text: 'What is your favorite color?',
//     required: false,
//     question_hiding_rules: [],
//     question_order: 0,
//     question_options: [],
//   })