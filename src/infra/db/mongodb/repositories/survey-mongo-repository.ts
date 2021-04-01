import { AddSurveyRepository , LoadSurveysRepository , LoadSurveyByIdRepository, CheckSurveyByIdRepository, LoadAnswersBySurveyIdRepository } from '@/data/protocols'
import { MongoHelper, QueryBuilder } from '@/infra/db/mongodb/helpers'
import { getSurveysCollection } from '@/infra/db/mongodb/collections'
import { ObjectId } from 'mongodb'
export class SurveyMongoRepository implements AddSurveyRepository,LoadSurveysRepository,LoadSurveyByIdRepository,CheckSurveyByIdRepository, LoadAnswersBySurveyIdRepository {
  async add (surveyParams: AddSurveyRepository.Params): Promise<void> {
    const surveysCollection = await getSurveysCollection()
    await surveysCollection.insertOne(surveyParams)
  }

  async loadAll (): Promise<LoadSurveysRepository.Result> {
    const surveysCollection = await getSurveysCollection()
    const rawSurveysList = await surveysCollection.find().toArray()
    return MongoHelper.mapArray(rawSurveysList)
  }

  async loadById (id: string): Promise<LoadSurveyByIdRepository.Result> {
    const surveysCollection = await getSurveysCollection()
    const survey = await surveysCollection.findOne({ _id: new ObjectId(id) })
    return MongoHelper.map(survey)
  }

  async loadAnswers (id: string): Promise<LoadAnswersBySurveyIdRepository.Result> {
    const surveysCollection = await getSurveysCollection()
    const query = new QueryBuilder()
      .match({
        _id: new ObjectId(id)
      })
      .project({
        _id: 0,
        possibleAnswers: '$possibleAnswers.answer'
      })
      .build()
    const surveys = await surveysCollection.aggregate(query).toArray() as unknown as [{possibleAnswers: string[]}]
    return surveys[0]?.possibleAnswers || []
  }

  async checkById (id: string): Promise<CheckSurveyByIdRepository.Result> {
    const surveysCollection = await getSurveysCollection()
    const survey = await surveysCollection.findOne({ _id: new ObjectId(id) },{ projection: { _id: 1 } })
    return !!survey
  }
}
