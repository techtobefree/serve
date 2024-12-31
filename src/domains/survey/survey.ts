import { observable, runInAction } from "mobx";

import { QuestionProps } from "../../components/Survey/QuestionProps";
import TextQuestion from "../../components/Survey/TextQuestion";
import { TableInsert, TableRows } from "../persistence/tables";

export const QUESTION_MAP: {
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

export type InsertSurveyQuestion =
  Omit<
    TableInsert['survey_question'],
    'survey_id' | 'created_by' | 'question_order' | 'question_text' | 'question_type'
  > & {
    question_options:
    Omit<
      TableInsert['survey_question_option'],
      'survey_id' | 'survey_question_id' | 'created_by'
    >[],
    question_hiding_rules:
    Omit<
      TableInsert['survey_question_hiding_rule'],
      'survey_id' | 'survey_question_id' | 'created_by'
    >[],
    question_text?: string,
    question_type?: keyof typeof QUESTION_TYPE,
    deleted?: boolean,
    edited?: boolean,
  }

export type InsertResponse = Omit<TableInsert['survey_response'], 'created_by'> & {
  question: TableRows['survey_question']
}

type SurveyStore = {
  current: {
    questions: InsertSurveyQuestion[],
    responses: InsertResponse[],
  }
}

export const surveyStore = observable<SurveyStore>({
  current: {
    questions: [],
    responses: [],
  }
})

export const QUESTION_TYPE = {
  text: 'text',
  long_text: 'long_text',
  first_name: 'first_name',
  last_name: 'last_name',
  email: 'email',
  phone: 'phone',
  street: 'street',
  city: 'city',
  state: 'state',
  postal_code: 'postal_code',
  country: 'country',

  // RATING: 'rating',
  // CURRENCY: 'currency',
  // PERCENTAGE: 'percentage',

  // CHECKBOX: 'checkbox',
  // DROPDOWN: 'dropdown',
  // MULTIPLE_CHOICE: 'multiple_choice',

  // DATE: 'date',
  // TIME: 'time',
  // DATE_TIME: 'date_time',
  // FILE_UPLOAD: 'file_upload',
  // IMAGE_UPLOAD: 'image_upload',
  // VIDEO_UPLOAD: 'video_upload',
  // AUDIO_UPLOAD: 'audio_upload',
  // LOCATION: 'location',
  // URL: 'url',
  // NUMBER: 'number',
  // SIGNATURE: 'signature',
  // LONG_TEXT: 'long_text',
  // RICH_TEXT: 'rich_text',
  // WEBSITE: 'website',
  // SOCIAL_MEDIA: 'social_media',
} as const

export function addQuestionToSurvey(question: InsertSurveyQuestion) {
  runInAction(() => {
    surveyStore.current.questions.push({ ...question, edited: true });
  })
}

// For now, updates are only before saving
export function updateSurveyQuestion(questionIndex: number, question: InsertSurveyQuestion) {
  runInAction(() => {
    surveyStore.current.questions[questionIndex] = { ...question, edited: true };
  })
}

export function removeQuestion(questionIndex: number) {
  runInAction(() => {
    if (surveyStore.current.questions[questionIndex].id) {
      surveyStore.current.questions[questionIndex].deleted = true;
    } else {
      surveyStore.current.questions.splice(questionIndex, 1);
    }
  })
}

export function closeQuestion(questionIndex: number) {
  runInAction(() => {
    surveyStore.current.questions[questionIndex].deleted = true;
  })
}

export function resetSurveyStoreQuestions(questions: InsertSurveyQuestion[]) {
  runInAction(() => {
    surveyStore.current.questions = questions
  })
}

export function setResponseText(responseIndex: number, responseText: string) {
  runInAction(() => {
    surveyStore.current.responses[responseIndex].response_text = responseText
  })
}

export function resetSurveyStoreResponse(responses: InsertResponse[]) {
  runInAction(() => {
    surveyStore.current.responses = responses
  })
}
