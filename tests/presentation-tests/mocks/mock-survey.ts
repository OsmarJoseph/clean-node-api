import { SurveyModel } from '@/domain/models'
import { AddSurvey, LoadSurveyById , LoadSurveys } from '@/domain/usecases'
import { mockSurveysModelList, mockSurveyModel } from '@/tests/domain-tests/mocks'

export class AddSurveySpy implements AddSurvey {
  data: AddSurvey.Params
  async add (data: AddSurvey.Params): Promise<void> {
    this.data = data
    return null
  }
}

export class LoadSurveysSpy implements LoadSurveys {
  callCount = 0
  result = mockSurveysModelList()
  async load (): Promise<SurveyModel[]> {
    this.callCount++
    return this.result
  }
}

export class LoadSurveyByIdSpy implements LoadSurveyById {
  id: string
  result = mockSurveyModel()
  async loadById (id: string): Promise<SurveyModel> {
    this.id = id
    return this.result
  }
}
