import { SurveyResultModel } from '@/domain/models/survey-result'
import { SaveSurveyResult, SaveSurveyResultParams } from '@/domain/usecases/survey-result/save-survey-result'
import { makeMockSurveyResultModel } from '@/domain/test'

export const makeMockSaveSurveyResult = (): SaveSurveyResult => {
  class SaveSurveyResultStub implements SaveSurveyResult {
    async save (surveyResultData: SaveSurveyResultParams): Promise<SurveyResultModel> {
      return makeMockSurveyResultModel()
    }
  }
  return new SaveSurveyResultStub()
}
