import { AddSurvey, LoadAnswersBySurveyId , LoadSurveys, CheckSurveyById } from '@/domain/usecases'
import { mockSurveysModelList } from '@/tests/_domain/mocks'

import faker from 'faker'

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
  async load (): Promise<LoadSurveys.Result> {
    this.callCount++
    return this.result
  }
}

export class LoadAnswersBySurveyIdSpy implements LoadAnswersBySurveyId {
  id: string
  result = [faker.random.word(),faker.random.word()]
  async loadAnswers (id: string): Promise<LoadAnswersBySurveyId.Result> {
    this.id = id
    return this.result
  }
}

export class CheckSurveyByIdSpy implements CheckSurveyById {
  id: string
  result = true
  async checkById (id: string): Promise<CheckSurveyById.Result> {
    this.id = id
    return this.result
  }
}
