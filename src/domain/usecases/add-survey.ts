import { SurveyAnswer } from '../models/survey'

export interface AddSurveyModel{
  question: string
  possibleAnswers: SurveyAnswer[]
}
export interface AddSurvey {
  add (data: AddSurveyModel): Promise<void>
}
