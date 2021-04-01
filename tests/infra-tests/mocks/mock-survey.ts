import { SurveyModel } from '@/domain/models'
import { SurveysCollection } from '@/infra/db/mongodb/collections'
import { MongoHelper } from '@/infra/db/mongodb/helpers'
import { mockAddSurveyParams } from '@/tests/domain-tests/mocks'

export const insertMockSurveyOnDatabase = async (surveysCollection: SurveysCollection): Promise<SurveyModel> => {
  const surveyParams = mockAddSurveyParams()
  const survey = await surveysCollection.insertOne(surveyParams)
  return MongoHelper.map(survey.ops[0])
}
