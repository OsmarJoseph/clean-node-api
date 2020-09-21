import { SurveyAnswer } from '@/domain/models/survey'

export type AddSurveyModel = {
  question: string
  possibleAnswers: SurveyAnswer[]
  date: Date
}
export interface AddSurvey {
  add (surveyData: AddSurveyModel): Promise<void>
}
