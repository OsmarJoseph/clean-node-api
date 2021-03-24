import { SurveyModel } from '@/domain/models'
import { mockSurveyModel,mockSurveysModelList } from '@/tests/domain-tests/mocks'
import { AddSurveyRepository , LoadSurveyByIdRepository , LoadSurveysRepository, CheckSurveyByIdRepository } from '@/data/protocols'

export class AddSurveyRepositorySpy implements AddSurveyRepository {
  surveyParams: AddSurveyRepository.Params
  async add (surveyParams: AddSurveyRepository.Params): Promise<void> {
    this.surveyParams = surveyParams
  }
}

export class LoadSurveyByIdRepositorySpy implements LoadSurveyByIdRepository {
  id: string
  result = mockSurveyModel()
  async loadById (id: string): Promise<LoadSurveyByIdRepository.Result> {
    this.id = id
    return this.result
  }
}
export class CheckSurveyByIdRepositorySpy implements CheckSurveyByIdRepository {
  id: string
  result =true
  async checkById (id: string): Promise<CheckSurveyByIdRepository.Result> {
    this.id = id
    return this.result
  }
}

export class LoadSurveysRepositorySpy implements LoadSurveysRepository {
  callCount = 0
  result = mockSurveysModelList()
  async loadAll (): Promise<SurveyModel[]> {
    this.callCount++
    return this.result
  }
}
