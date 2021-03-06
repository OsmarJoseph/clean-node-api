import { SaveSurveyResult, SaveSurveyResultRepository, SaveSurveyResultParams, SurveyResultModel,LoadSurveyResultRepository } from './db-save-survey-result-protocols'

export class DbSaveSurveyResult implements SaveSurveyResult {
  constructor (
    private readonly saveSurveyResultRepository: SaveSurveyResultRepository,
    private readonly loadSurveyResultRepository: LoadSurveyResultRepository

  ) { }

  async save (surveyResultData: SaveSurveyResultParams): Promise<SurveyResultModel> {
    await this.saveSurveyResultRepository.save(surveyResultData)
    const loadedSurveyResult =
    await
    this.loadSurveyResultRepository
      .loadBySurveyId(surveyResultData.surveyId)

    return loadedSurveyResult
  }
}
