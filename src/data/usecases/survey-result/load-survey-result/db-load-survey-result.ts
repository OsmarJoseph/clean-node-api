import { LoadSurveyResultRepository,LoadSurveyResult,SurveyResultModel,LoadSurveyByIdRepository } from './db-load-survey-result-protocols'

export class DbLoadSurveyResult implements LoadSurveyResult {
  constructor (
    private readonly loadSurveyResultRepository: LoadSurveyResultRepository,
    private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository
  ) {}

  async load (surveyId: string): Promise<SurveyResultModel> {
    const loadedSurveyResult = await this.loadSurveyResultRepository.loadBySurveyId(surveyId)
    if (!loadedSurveyResult) {
      await this.loadSurveyByIdRepository.loadById(surveyId)
    }
    return loadedSurveyResult
  }
}
