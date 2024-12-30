import { observable, runInAction } from "mobx";

import { TableInsert } from "../persistence/tables";

export type InsertSurveyQuestion = Omit<TableInsert['survey_question'], 'survey_id' | 'created_by' | 'question_order'> & {
  question_options: Omit<TableInsert['survey_question_option'], 'survey_id' | 'survey_question_id' | 'created_by'>[],
  question_hiding_rules: Omit<TableInsert['survey_question_hiding_rule'], 'survey_id' | 'survey_question_id' | 'created_by'>[],
  question_type: keyof typeof QUESTION_TYPE,
  deleted?: boolean,
  edited?: boolean,
}

type SurveyStore = {
  current: {
    questions: InsertSurveyQuestion[],
  }
}

export const surveyStore = observable<SurveyStore>({
  current: {
    questions: [],
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

export function resetSurveyStore(questions: InsertSurveyQuestion[]) {
  runInAction(() => {
    surveyStore.current.questions = questions
  })
}
