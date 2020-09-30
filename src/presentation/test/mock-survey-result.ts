import { SurveyResultModel } from '@/domain/models/survey-result'
import { SaveSurveyResult, SaveSurveyResultParams } from '@/domain/usecases/survey-result/save-survey-result'
import { LoadSurveyResult } from '@/domain/usecases/survey-result/load-survey-result'
import { makeMockSurveyResultModel } from '@/domain/test'

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
