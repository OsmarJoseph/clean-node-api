import { SurveyModel } from '@/domain/models'
import { AddSurveyParams } from '@/domain/usecases'
import { makeMockSurveyModel,makeMockSurveysModelList } from '@/tests/domain-tests/mocks'
import { AddSurveyRepository , LoadSurveyByIdRepository , LoadSurveysRepository } from '@/data/protocols'

export class AddSurveyRepositorySpy implements AddSurveyRepository {
  surveyParams: AddSurveyParams
  async add (surveyParams: AddSurveyParams): Promise<void> {
    this.surveyParams = surveyParams
  }
}

export class LoadSurveyByIdRepositorySpy implements LoadSurveyByIdRepository {
  id: string
  result = makeMockSurveyModel()
  async loadById (id: string): Promise<SurveyModel> {
    this.id = id
    return this.result
  }
}

export class LoadSurveysRepositorySpy implements LoadSurveysRepository {
  callCount = 0
  result = makeMockSurveysModelList()
  async loadAll (): Promise<SurveyModel[]> {
    this.callCount++
    return this.result
  }
}
