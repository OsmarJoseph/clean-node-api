import { LoadAnswersBySurveyId } from '@/domain/usecases'
import { LoadAnswersBySurveyIdRepository } from '@/data/protocols'

export class DbLoadAnswersBySurveyId implements LoadAnswersBySurveyId {
  constructor(private readonly loadSurveyByIdRepository: LoadAnswersBySurveyIdRepository) {}

  async loadAnswers(id: string): Promise<LoadAnswersBySurveyId.Result> {
    return await this.loadSurveyByIdRepository.loadAnswers(id)
  }
}
