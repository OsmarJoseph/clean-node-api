import { SaveSurveyResultRepository, LoadSurveyResultRepository } from '@/data/protocols'
import { mockSurveyResultModel } from '@/tests/domain-tests/mocks'

export class SaveSurveyResultRepositorySpy implements SaveSurveyResultRepository {
  surveyResultParams: SaveSurveyResultRepository.Params

  async save (surveyResultParams: SaveSurveyResultRepository.Params): Promise<void> {
    this.surveyResultParams = surveyResultParams
  }
}

export class LoadSurveyResultRepositorySpy implements LoadSurveyResultRepository {
  surveyId: string
  result = mockSurveyResultModel()
  async loadBySurveyId (surveyId: string): Promise<LoadSurveyResultRepository.Result> {
    this.surveyId = surveyId
    return this.result
  }
}
