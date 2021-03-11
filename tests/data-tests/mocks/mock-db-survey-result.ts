import { SurveyResultModel } from '@/domain/models'
import { SaveSurveyResultParams } from '@/domain/usecases'
import { SaveSurveyResultRepository , LoadSurveyResultRepository } from '@/data/protocols'
import { makeMockSurveyResultModel } from '@/tests/domain-tests/mocks'

export const makeMockSaveSurveyResultRepository = (): SaveSurveyResultRepository => {
  class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
    async save (surveyResultData: SaveSurveyResultParams): Promise<void> {}
  }
  return new SaveSurveyResultRepositoryStub()
}

export const makeMockLoadSurveyResultRepository = (): LoadSurveyResultRepository => {
  class LoadSurveyResultRepositoryStub implements LoadSurveyResultRepository {
    async loadBySurveyId (surveyId: string): Promise<SurveyResultModel> {
      return makeMockSurveyResultModel()
    }
  }
  return new LoadSurveyResultRepositoryStub()
}
