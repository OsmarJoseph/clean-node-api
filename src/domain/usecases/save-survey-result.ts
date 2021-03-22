import { SurveyResultModel } from '@/domain/models'

export type SaveSurveyResultParams = {
  surveyId: string
  accountId: string
  answer: string
  date: Date
}

export interface SaveSurveyResult {
  save: (surveyResultData: SaveSurveyResultParams) => Promise<SurveyResultModel>
}
