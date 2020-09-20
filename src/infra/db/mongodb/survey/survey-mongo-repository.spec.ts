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

const insertSurveysOnDatabase = async (): Promise<void> => {
  await surveyCollection.insertMany([makeSurveyData(),makeSurveyData()])
}

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
  describe('add',() => {
    test('Should create a survey on success', async () => {
      const sut = makeSut()
      await sut.add(makeSurveyData())
      const savedSurvey = await surveyCollection.findOne({})
      expect(savedSurvey).toBeTruthy()
    })
  })
  describe('loadAll',() => {
    test('Should load a empty list if db is clean', async () => {
      const sut = makeSut()
      const surveysList = await sut.loadAll()
      expect(surveysList.length).toBe(0)
    })
    test('Should load all surveys on success', async () => {
      await insertSurveysOnDatabase()
      const sut = makeSut()
      const surveysList = await sut.loadAll()
      expect(surveysList.length).toBe(2)
      expect(surveysList[0].question).toBe('any_question')
      expect(surveysList[1].question).toBe('any_question')
    })
  })
})
