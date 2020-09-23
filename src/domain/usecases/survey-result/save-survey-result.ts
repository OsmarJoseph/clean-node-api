import { SurveyResultModel } from '@/domain/models/survey-result'

export type SaveSurveyResultParams = Omit<SurveyResultModel,'id'>

export interface SaveSurveyResult {
  save (surveyResultData: SaveSurveyResultParams): Promise<SurveyResultModel>
}
