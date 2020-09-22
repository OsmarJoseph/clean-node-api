import { SurveyModel } from '@/domain/models/survey'
import { AddSurveyModel } from '@/domain/usecases/survey/add-survey'
import { AddSurveyRepository } from '@/data/protocols/db/survey/add-survey-repository'
import { LoadSurveysRepository } from '@/data/protocols/db/survey/load-surveys-repository'
import { LoadSurveyByIdRepository } from '@/data/protocols/db/survey/load-survey-by-id-repository'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { getSurveysCollection } from '@/infra/db/mongodb/collections'
export class SurveyMongoRepository implements AddSurveyRepository,LoadSurveysRepository,LoadSurveyByIdRepository {
  async add (surveyData: AddSurveyModel): Promise<void> {
    const surveyCollection = await getSurveysCollection()
    await surveyCollection.insertOne(surveyData)
  }

  async loadAll (): Promise<SurveyModel[]> {
    const surveyCollection = await getSurveysCollection()
    const rawSurveysList = await surveyCollection.find().toArray()
    return MongoHelper.mapArray(rawSurveysList)
  }

  async loadById (id: string): Promise<SurveyModel> {
    const surveyCollection = await getSurveysCollection()
    const survey = await surveyCollection.findOne({ _id: id })
    return MongoHelper.map(survey)
  }
}