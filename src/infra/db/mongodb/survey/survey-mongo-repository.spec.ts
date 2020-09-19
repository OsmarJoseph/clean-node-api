import { Collection } from 'mongodb'
import { AddSurveyModel } from '../../../../domain/usecases/add-survey'
import { MongoHelper } from '../helpers/mongo-helper'
import { SurveyMongoRepository } from './survey-mongo-repository'
let surveyCollection: Collection
const makeSurveyData = (): AddSurveyModel => (
  {
    question: 'any_question',
    possibleAnswers: [{
      image: 'any_image',
      answer: 'any_answer'
    }],
    date: new Date()
  }
)

const makeSut = (): SurveyMongoRepository => new SurveyMongoRepository()
describe('Survey Mongo Repository',() => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
  })
  test('Should create a survey on success', async () => {
    const sut = makeSut()
    await sut.add(makeSurveyData())
    const savedSurvey = await surveyCollection.findOne({})
    expect(savedSurvey).toBeTruthy()
  })
})
