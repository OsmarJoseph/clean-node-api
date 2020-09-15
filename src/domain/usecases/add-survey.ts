import { SurveyAnswer } from '../models/survey'

export interface AddSurveyModel{
  question: string
  possibleAnswers: SurveyAnswer[]
}
export interface AddSurvey {
  add (surveyData: AddSurveyModel): Promise<void>
}
