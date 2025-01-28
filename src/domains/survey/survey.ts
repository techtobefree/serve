import { observable, runInAction } from "mobx";

import CheckboxQuestion, {
  CheckboxResponse,
} from "../../components/Survey/Question/Checkbox";
import InfoQuestion, {
  InfoResponse,
} from "../../components/Survey/Question/Info";
import TextQuestion, {
  TextResponse,
} from "../../components/Survey/Question/Text";
import UrlQuestion, { UrlResponse } from "../../components/Survey/Question/Url";
import { TableInsert, TableRows } from "../persistence/tables";

export const QUESTION_MAP: {
  [key in keyof typeof QUESTION_TYPE]: {
    label: string;
    question: (props: QuestionProps) => React.JSX.Element;
    response: (props: ResponseProps) => React.JSX.Element;
  };
} = {
  info: { label: "Info", question: InfoQuestion, response: InfoResponse },
  url: { label: "URL", question: UrlQuestion, response: UrlResponse },
  checkbox: {
    label: "Checkbox",
    question: CheckboxQuestion,
    response: CheckboxResponse,
  },
  text: { label: "Text", question: TextQuestion, response: TextResponse },
  long_text: {
    label: "Long Text",
    question: TextQuestion,
    response: TextResponse,
  },
  first_name: {
    label: "First Name",
    question: TextQuestion,
    response: TextResponse,
  },
  last_name: {
    label: "Last Name",
    question: TextQuestion,
    response: TextResponse,
  },
  email: { label: "Email", question: TextQuestion, response: TextResponse },
  phone: { label: "Phone", question: TextQuestion, response: TextResponse },
  street: { label: "Street", question: TextQuestion, response: TextResponse },
  city: { label: "City", question: TextQuestion, response: TextResponse },
  state: { label: "State", question: TextQuestion, response: TextResponse },
  postal_code: {
    label: "Postal Code",
    question: TextQuestion,
    response: TextResponse,
  },
  country: { label: "Country", question: TextQuestion, response: TextResponse },
};

export type QuestionProps = {
  id: string | undefined;
  index: number;
  label: string;
  canEdit: boolean;
  question_type: keyof typeof QUESTION_TYPE;
  question_text?: string;
};

export type ResponseProps = {
  question: TableRows["survey_question"];
  index: number;
};

export type SurveyQuestion = Omit<
  TableInsert["survey_question"],
  | "survey_id"
  | "created_by"
  | "question_order"
  | "question_text"
  | "question_type"
>;

export type InsertSurveyQuestion = Omit<
  TableInsert["survey_question"],
  | "survey_id"
  | "created_by"
  | "question_order"
  | "question_text"
  | "question_type"
> & {
  question_options: Omit<
    TableInsert["survey_question_option"],
    "survey_id" | "survey_question_id" | "created_by"
  >[];
  question_hiding_rules: Omit<
    TableInsert["survey_question_hiding_rule"],
    "survey_id" | "survey_question_id" | "created_by"
  >[];
  question_text?: string;
  question_type?: keyof typeof QUESTION_TYPE;
  deleted?: boolean;
  edited?: boolean;
};

export type InsertResponse = Omit<
  TableInsert["survey_response"],
  "created_by"
> & {
  question: TableRows["survey_question"];
};

export type MaybeResponse = Omit<InsertResponse, "response_text"> & {
  response_text?: string;
};

type SurveyStore = {
  current: {
    questions: InsertSurveyQuestion[];
    responses: MaybeResponse[];
  };
};

export const SURVEY_TYPE = {
  attendee: "attendee",
  volunteer: "volunteer",
} as const;

export const surveyStore = observable<SurveyStore>({
  current: {
    questions: [],
    responses: [],
  },
});

export const QUESTION_TYPE = {
  info: "info",
  checkbox: "checkbox",
  url: "url",
  text: "text",
  long_text: "long_text",
  first_name: "first_name",
  last_name: "last_name",
  email: "email",
  phone: "phone",
  street: "street",
  city: "city",
  state: "state",
  postal_code: "postal_code",
  country: "country",

  // RATING: 'rating',
  // CURRENCY: 'currency',
  // PERCENTAGE: 'percentage',

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
  // NUMBER: 'number',
  // SIGNATURE: 'signature',
  // LONG_TEXT: 'long_text',
  // RICH_TEXT: 'rich_text',
  // WEBSITE: 'website',
  // SOCIAL_MEDIA: 'social_media',
} as const;

export const READ_ONLY_QUESTION_TYPES = [
  QUESTION_TYPE.info,
  QUESTION_TYPE.url,
] as const;

export function addQuestionToSurvey(question: InsertSurveyQuestion) {
  runInAction(() => {
    surveyStore.current.questions.push({ ...question, edited: true });
  });
}

// For now, updates are only before saving
export function updateSurveyQuestion(
  questionIndex: number,
  question: InsertSurveyQuestion
) {
  runInAction(() => {
    surveyStore.current.questions[questionIndex] = {
      ...question,
      edited: true,
    };
  });
}

export function removeQuestion(questionIndex: number) {
  runInAction(() => {
    if (surveyStore.current.questions[questionIndex].id) {
      surveyStore.current.questions[questionIndex].deleted = true;
    } else {
      surveyStore.current.questions.splice(questionIndex, 1);
    }
  });
}

export function closeQuestion(questionIndex: number) {
  runInAction(() => {
    surveyStore.current.questions[questionIndex].deleted = true;
  });
}

export function resetSurveyStoreQuestions(questions: InsertSurveyQuestion[]) {
  runInAction(() => {
    surveyStore.current.questions = questions;
  });
}

export function setResponseText(
  responseIndex: number,
  responseText: string | undefined
) {
  runInAction(() => {
    if (responseText === undefined) {
      delete surveyStore.current.responses[responseIndex].response_text;
    } else {
      surveyStore.current.responses[responseIndex].response_text = responseText;
    }
  });
}

export function resetSurveyStoreResponse(responses: InsertResponse[]) {
  runInAction(() => {
    surveyStore.current.responses = responses;
  });
}
