import { SurveyResultModel } from '@/domain/models'
import { SaveSurveyResultParams } from '@/domain/usecases'
import { SaveSurveyResultRepository, LoadSurveyResultRepository } from '@/data/protocols'
import { makeMockSurveyResultModel } from '@/tests/domain-tests/mocks'

export class SaveSurveyResultRepositorySpy implements SaveSurveyResultRepository {
  surveyResultData: SaveSurveyResultParams

  async save (surveyResultData: SaveSurveyResultParams): Promise<void> {
    this.surveyResultData = surveyResultData
  }
}

export class LoadSurveyResultRepositorySpy implements LoadSurveyResultRepository {
  surveyId: string
  async loadBySurveyId (surveyId: string): Promise<SurveyResultModel> {
    this.surveyId = surveyId
    return makeMockSurveyResultModel()
  }
}
