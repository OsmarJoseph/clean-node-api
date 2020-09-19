import { SurveyAnswer } from '../models/survey'

export interface AddSurveyModel{
  question: string
  possibleAnswers: SurveyAnswer[]
  date: Date
}
export interface AddSurvey {
  add (surveyData: AddSurveyModel): Promise<void>
}
