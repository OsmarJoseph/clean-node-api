import { SaveSurveyResult } from '@/domain/usecases'
import { SaveSurveyResultRepository, LoadSurveyResultRepository } from '@/data/protocols'

export class DbSaveSurveyResult implements SaveSurveyResult {
  constructor(
    private readonly saveSurveyResultRepository: SaveSurveyResultRepository,
    private readonly loadSurveyResultRepository: LoadSurveyResultRepository,
  ) {}

  async save(surveyResultParams: SaveSurveyResult.Params): Promise<SaveSurveyResult.Result> {
    await this.saveSurveyResultRepository.save(surveyResultParams)
    const loadedSurveyResult = await this.loadSurveyResultRepository.loadBySurveyId(
      surveyResultParams.surveyId,
    )

    return loadedSurveyResult
  }
}
