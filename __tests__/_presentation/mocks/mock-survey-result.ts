import { SaveSurveyResult, LoadSurveyResult } from '@/domain/usecases'
import { mockSurveyResultModel } from '@/tests/_domain/mocks'

export class SaveSurveyResultSpy implements SaveSurveyResult {
  surveyResultParams: SaveSurveyResult.Params
  result = mockSurveyResultModel()
  async save (surveyResultParams: SaveSurveyResult.Params): Promise<SaveSurveyResult.Result> {
    this.surveyResultParams = surveyResultParams
    return this.result
  }
}

export class LoadSurveyResultSpy implements LoadSurveyResult {
  surveyId: string
  result = mockSurveyResultModel()
  async load (surveyId: string): Promise<LoadSurveyResult.Result> {
    this.surveyId = surveyId
    return this.result
  }
}
