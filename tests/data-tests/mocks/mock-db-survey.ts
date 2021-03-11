import { SurveyModel } from '@/domain/models'
import { AddSurveyParams } from '@/domain/usecases'
import { makeMockSurveyModel,makeMockSurveysModelList } from '@/tests/domain-tests/mocks'
import { AddSurveyRepository , LoadSurveyByIdRepository , LoadSurveysRepository } from '@/data/protocols'

export const makeMockAddSurveyRepository = (): AddSurveyRepository => {
  class AddSurveyRepositoryStub implements AddSurveyRepository {
    async add (surveyParams: AddSurveyParams): Promise<void> {}
  }
  return new AddSurveyRepositoryStub()
}

export const makeMockLoadSurveyByIdRepository = (): LoadSurveyByIdRepository => {
  class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {
    async loadById (id: string): Promise<SurveyModel> {
      return makeMockSurveyModel()
    }
  }
  return new LoadSurveyByIdRepositoryStub()
}

export const makeLoadSurveysRepository = (): LoadSurveysRepository => {
  class LoadSurveysRepositoryStub implements LoadSurveysRepository {
    async loadAll (): Promise<SurveyModel[]> {
      return makeMockSurveysModelList()
    }
  }
  return new LoadSurveysRepositoryStub()
}
