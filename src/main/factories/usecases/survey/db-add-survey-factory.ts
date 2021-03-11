import { AddSurvey } from '@/domain/usecases'
import { DbAddSurvey } from '@/data/usecases'
import { SurveyMongoRepository } from '@/infra/db/mongodb/repositories'

export const makeDbAddSurvey = (): AddSurvey => {
  return new DbAddSurvey(new SurveyMongoRepository())
}
