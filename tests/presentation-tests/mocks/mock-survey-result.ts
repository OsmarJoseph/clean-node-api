import { SurveyResultModel } from '@/domain/models'
import { SaveSurveyResult, SaveSurveyResultParams , LoadSurveyResult } from '@/domain/usecases'
import { makeMockSurveyResultModel } from '@/tests/domain-tests/mocks'

export const makeMockSaveSurveyResult = (): SaveSurveyResult => {
  class SaveSurveyResultStub implements SaveSurveyResult {
    async save (surveyResultData: SaveSurveyResultParams): Promise<SurveyResultModel> {
      return makeMockSurveyResultModel()
    }
  }
  return new SaveSurveyResultStub()
}
export const makeMockLoadSurveyResult = (): LoadSurveyResult => {
  class LoadSurveyResultStub implements LoadSurveyResult {
    async load (surveyId: string): Promise<SurveyResultModel> {
      return makeMockSurveyResultModel()
    }
  }
  return new LoadSurveyResultStub()
}
