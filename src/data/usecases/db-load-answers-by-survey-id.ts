import { LoadAnswersBySurveyId } from '@/domain/usecases'
import { LoadSurveyByIdRepository } from '@/data/protocols'

export class DbLoadAnswersBySurveyId implements LoadAnswersBySurveyId {
  constructor (
    private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository
  ) {}

  async loadAnswers (id: string): Promise<LoadAnswersBySurveyId.Result> {
    const survey = await this.loadSurveyByIdRepository.loadById(id)
    return survey?.possibleAnswers.map(({ answer }) => answer) || []
  }
}
