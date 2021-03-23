import { SurveyModel } from '@/domain/models'
import { AddSurveyRepository , LoadSurveysRepository , LoadSurveyByIdRepository } from '@/data/protocols'
import { MongoHelper } from '@/infra/db/mongodb/helpers'
import { getSurveysCollection } from '@/infra/db/mongodb/collections'
import { ObjectId } from 'mongodb'
export class SurveyMongoRepository implements AddSurveyRepository,LoadSurveysRepository,LoadSurveyByIdRepository {
  async add (surveyParams: AddSurveyRepository.Params): Promise<void> {
    const surveyCollection = await getSurveysCollection()
    await surveyCollection.insertOne(surveyParams)
  }

  async loadAll (): Promise<SurveyModel[]> {
    const surveyCollection = await getSurveysCollection()
    const rawSurveysList = await surveyCollection.find().toArray()
    return MongoHelper.mapArray(rawSurveysList)
  }

  async loadById (id: string): Promise<LoadSurveyByIdRepository.Result> {
    const surveyCollection = await getSurveysCollection()
    const survey = await surveyCollection.findOne({ _id: new ObjectId(id) })
    return MongoHelper.map(survey)
  }
}
