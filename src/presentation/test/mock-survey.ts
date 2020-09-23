import { AddSurvey, AddSurveyParams } from '@/domain/usecases/survey/add-survey'
import { SurveyModel } from '@/domain/models/survey'
import { LoadSurveyById } from '@/domain/usecases/survey/load-survey-by-id'
import { LoadSurveys } from '@/domain/usecases/survey/load-surveys'
import { makeMockSurveysModelList, makeMockSurveyModel } from '@/domain/test'

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
