import { TableInsert } from "../persistence/tables";

export type InsertSurveyQuestion = Omit<TableInsert['survey_question'], 'survey_id' | 'created_by'> & {
    question_options: Omit<TableInsert['survey_question_option'], 'survey_id' | 'survey_question_id' | 'created_by'>[]
    question_hiding_rules: Omit<TableInsert['survey_question_hiding_rule'], 'survey_id' | 'survey_question_id' | 'created_by'>[]
}

export const QUESTION_TYPE = {
    TEXT: 'text',
    FIRST_NAME: 'first_name',
    LAST_NAME: 'last_name',
    EMAIL: 'email',
    PHONE: 'phone',
    STREET: 'street',
    CITY: 'city',
    STATE: 'state',
    POSTAL_CODE: 'postal_code',
    COUNTRY: 'country',

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
}
