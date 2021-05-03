import { LoadSurveyResult } from '@/domain/usecases'
import { LoadSurveyResultRepository, LoadSurveyByIdRepository } from '@/data/protocols'

export class DbLoadSurveyResult implements LoadSurveyResult {
  constructor(
    private readonly loadSurveyResultRepository: LoadSurveyResultRepository,
    private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository,
  ) {}

  async load(surveyId: string): Promise<LoadSurveyResult.Result> {
    let surveyResult = await this.loadSurveyResultRepository.loadBySurveyId(surveyId)
    if (!surveyResult) {
      const survey = await this.loadSurveyByIdRepository.loadById(surveyId)
      const answers = survey.possibleAnswers.map((answerObject) => ({
        ...answerObject,
        count: 0,
        percent: 0,
      }))
      surveyResult = {
        surveyId: survey.id,
        question: survey.question,
        date: survey.date,
        answers,
      }
    }
    return surveyResult
  }
}
