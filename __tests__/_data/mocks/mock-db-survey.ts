import { mockSurveyModel, mockSurveysModelList } from '@/tests/_domain/mocks'
import {
  AddSurveyRepository,
  LoadSurveyByIdRepository,
  LoadSurveysRepository,
  CheckSurveyByIdRepository,
  LoadAnswersBySurveyIdRepository
} from '@/data/protocols'

import faker from 'faker'

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
export class LoadAnswersBySurveyIdRepositorySpy
implements LoadAnswersBySurveyIdRepository {
  id: string
  result = [faker.random.word(), faker.random.word()]

  async loadAnswers (
    id: string
  ): Promise<LoadAnswersBySurveyIdRepository.Result> {
    this.id = id
    return this.result
  }
}
export class CheckSurveyByIdRepositorySpy implements CheckSurveyByIdRepository {
  id: string
  result = true
  async checkById (id: string): Promise<CheckSurveyByIdRepository.Result> {
    this.id = id
    return this.result
  }
}

export class LoadSurveysRepositorySpy implements LoadSurveysRepository {
  callCount = 0
  result = mockSurveysModelList()
  async loadAll (): Promise<LoadSurveysRepository.Result> {
    this.callCount++
    return this.result
  }
}
