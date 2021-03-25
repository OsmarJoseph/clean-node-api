import { SurveyModel } from '@/domain/models'
import { AddSurveyRepository , LoadSurveysRepository , LoadSurveyByIdRepository, CheckSurveyByIdRepository, LoadAnswersBySurveyIdRepository } from '@/data/protocols'
import { MongoHelper, QueryBuilder } from '@/infra/db/mongodb/helpers'
import { getSurveysCollection } from '@/infra/db/mongodb/collections'
import { ObjectId } from 'mongodb'
export class SurveyMongoRepository implements AddSurveyRepository,LoadSurveysRepository,LoadSurveyByIdRepository,CheckSurveyByIdRepository, LoadAnswersBySurveyIdRepository {
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

  async loadAnswers (id: string): Promise<LoadAnswersBySurveyIdRepository.Result> {
    const surveyCollection = await getSurveysCollection()
    const query = new QueryBuilder()
      .match({
        _id: new ObjectId(id)
      })
      .project({
        _id: 0,
        possibleAnswers: '$possibleAnswers.answer'
      })
      .build()
    const surveys = await surveyCollection.aggregate(query).toArray() as unknown as [{possibleAnswers: string[]}]
    return surveys[0]?.possibleAnswers || []
  }

  async checkById (id: string): Promise<CheckSurveyByIdRepository.Result> {
    const surveyCollection = await getSurveysCollection()
    const survey = await surveyCollection.findOne({ _id: new ObjectId(id) },{ projection: { _id: 1 } })
    return !!survey
  }
}
