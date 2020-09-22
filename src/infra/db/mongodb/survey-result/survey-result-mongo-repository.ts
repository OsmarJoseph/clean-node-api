import { SurveyResultModel } from '@/domain/models/survey-result'
import { SaveSurveyResultModel } from '@/domain/usecases/save-survey-result'
import { SaveSurveyResultRepository } from '@/data/protocols/db/survey/save-survey-result-repository'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'

export class SurveyResultMongoRepository implements SaveSurveyResultRepository {
  async save (surveyResultData: SaveSurveyResultModel): Promise<SurveyResultModel> {
    const surveyResultsCollection = await MongoHelper.getCollection('surveyResults')
    const savedSurveyResult = await surveyResultsCollection.insertOne(surveyResultData)
    return MongoHelper.map(savedSurveyResult.ops[0])
  }
}
