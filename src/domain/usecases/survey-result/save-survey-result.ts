import { SurveyResultModel } from '@/domain/models/survey-result'

export type SaveSurveyResultParams = {
  surveyId: string
  accountId: string
  answer: string
  date: Date
}

export interface SaveSurveyResult {
  save (surveyResultData: SaveSurveyResultParams): Promise<SurveyResultModel>
}
