import { SurveyResultModel } from '@/domain/models/survey-result'
import { SaveSurveyResultModel } from '@/domain/usecases/save-survey-result'
import { SaveSurveyResultRepository } from '@/data/protocols/db/survey/save-survey-result-repository'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { Collection, WithId } from 'mongodb'

export class SurveyResultMongoRepository implements SaveSurveyResultRepository {
  async save (surveyResultData: SaveSurveyResultModel): Promise<SurveyResultModel> {
    const surveyResultsCollection = await MongoHelper.getCollection('surveyResults') as Collection<WithId<SaveSurveyResultModel>>
    const { surveyId,accountId,answer,date } = surveyResultData
    const savedSurveyResult = await surveyResultsCollection.findOneAndUpdate(
      {
        surveyId,
        accountId
      },{
        $set: {
          answer,
          date
        }
      },{
        upsert: true,
        returnOriginal: false
      })
    return savedSurveyResult.value && MongoHelper.map(savedSurveyResult.value)
  }
}
