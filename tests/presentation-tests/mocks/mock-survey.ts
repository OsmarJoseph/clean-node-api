import { SurveyModel } from '@/domain/models'
import { AddSurvey, AddSurveyParams , LoadSurveyById , LoadSurveys } from '@/domain/usecases'
import { makeMockSurveysModelList, makeMockSurveyModel } from '@/tests/domain-tests/mocks'

export class AddSurveySpy implements AddSurvey {
  data: AddSurveyParams
  async add (data: AddSurveyParams): Promise<void> {
    this.data = data
    return null
  }
}

export class LoadSurveysSpy implements LoadSurveys {
  callCount = 0
  result = makeMockSurveysModelList()
  async load (): Promise<SurveyModel[]> {
    this.callCount++
    return this.result
  }
}

export class LoadSurveyByIdSpy implements LoadSurveyById {
  id: string
  result = makeMockSurveyModel()
  async loadById (id: string): Promise<SurveyModel> {
    this.id = id
    return this.result
  }
}
