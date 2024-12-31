import { QUESTION_TYPE } from "../../domains/survey/survey"

export type QuestionProps = {
    id: string | undefined,
    index: number,
    label: string,
    canEdit: boolean,
    question_type: keyof typeof QUESTION_TYPE,
    question_text?: string,
}
