import { SurveyResultModel } from '@/domain/models/survey-result'

export type SaveSurveyResultModel = Omit<SurveyResultModel,'id'>

export interface SaveSurveyResult {
  add (surveyData: SaveSurveyResultModel): Promise<SurveyResultModel>
}