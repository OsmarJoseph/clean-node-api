import { SaveSurveyResult } from '@/domain/usecases'
import { SurveyResultMongoRepository } from '@/infra/db/mongodb/repositories'
import { DbSaveSurveyResult } from '@/data/usecases'

export const makeDbSaveSurveyResult = (): SaveSurveyResult => {
  const surveyResultMongoRepository = new SurveyResultMongoRepository()
  return new DbSaveSurveyResult(surveyResultMongoRepository, surveyResultMongoRepository)
}
