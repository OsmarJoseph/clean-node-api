import { SurveyModel } from '@/domain/models'
import { AddSurvey, AddSurveyParams , LoadSurveyById , LoadSurveys } from '@/domain/usecases'
import { makeMockSurveysModelList, makeMockSurveyModel } from '@/tests/domain-tests/mocks'

export const makeMockAddSurvey = (): AddSurvey => {
  class AddSurveyStub implements AddSurvey {
    async add (data: AddSurveyParams): Promise<void> {
      return null
    }
  }
  return new AddSurveyStub()
}

export const makeMockLoadSurveys = (): LoadSurveys => {
  class LoadSurveysStub implements LoadSurveys {
    async load (): Promise<SurveyModel[]> {
      return makeMockSurveysModelList()
    }
  }
  return new LoadSurveysStub()
}

export const makeMockLoadSurveyById = (): LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    async loadById (id: string): Promise<SurveyModel> {
      return makeMockSurveyModel()
    }
  }
  return new LoadSurveyByIdStub()
}
