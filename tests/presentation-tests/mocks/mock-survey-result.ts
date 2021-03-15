import { SurveyResultModel } from '@/domain/models'
import { SaveSurveyResult, SaveSurveyResultParams , LoadSurveyResult } from '@/domain/usecases'
import { makeMockSurveyResultModel } from '@/tests/domain-tests/mocks'

export class SaveSurveyResultSpy implements SaveSurveyResult {
  surveyResultData: SaveSurveyResultParams
  result = makeMockSurveyResultModel()
  async save (surveyResultData: SaveSurveyResultParams): Promise<SurveyResultModel> {
    this.surveyResultData = surveyResultData
    return this.result
  }
}

export class LoadSurveyResultSpy implements LoadSurveyResult {
  surveyId: string
  result= makeMockSurveyResultModel()
  async load (surveyId: string): Promise<SurveyResultModel> {
    this.surveyId = surveyId
    return this.result
  }
}
