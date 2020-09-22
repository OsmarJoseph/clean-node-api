import { SurveyResultModel } from '@/domain/models/survey-result'
import { SaveSurveyResultModel } from '@/domain/usecases/save-survey-result'
import { SaveSurveyResultRepository } from '@/data/protocols/db/survey/save-survey-result-repository'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { getSurveyResultsCollection } from '@/infra/db/mongodb/collections'

export class SurveyResultMongoRepository implements SaveSurveyResultRepository {
  async save (surveyResultData: SaveSurveyResultModel): Promise<SurveyResultModel> {
    const surveyResultsCollection = await getSurveyResultsCollection()
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
    return MongoHelper.map(savedSurveyResult.value)
  }
}
