import { SurveyResultModel } from '@/domain/models'
import { SurveyResultsCollection } from '@/infra/db/mongodb/collections'
import { MongoHelper } from '@/infra/db/mongodb/helpers'
import { SaveSurveyResultRepository } from '@/data/protocols'

export const insertMockSurveyResultOnDatabase = async (
  surveyResultParams: SaveSurveyResultRepository.Params,
  surveyResultsCollection: SurveyResultsCollection,
): Promise<SurveyResultModel> => {
  const savedSurveyResult = await surveyResultsCollection.insertOne(surveyResultParams)
  return MongoHelper.map(savedSurveyResult.ops[0])
}
