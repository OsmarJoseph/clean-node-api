import { LoadAnswersBySurveyId } from '@/domain/usecases'
import { DbLoadAnswersBySurveyId } from '@/data/usecases'
import { SurveyMongoRepository } from '@/infra/db/mongodb/repositories'

export const makeDbLoadAnswersBySurveyId = (): LoadAnswersBySurveyId => {
  const surveyMongoRepository = new SurveyMongoRepository()
  return new DbLoadAnswersBySurveyId(surveyMongoRepository)
}
