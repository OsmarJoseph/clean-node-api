import { AddSurveyModel } from '@/domain/usecases/survey/add-survey'
import { SurveyMongoRepository } from './survey-mongo-repository'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { getSurveysCollection, SurveysCollection } from '@/infra/db/mongodb/collections'

let surveyCollection: SurveysCollection
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

const insertSurveyOnDatabaseAndGetId = async (): Promise<string> => {
  const survey = await surveyCollection.insertOne(makeSurveyData())
  return survey.ops[0]._id as unknown as string
}

const makeSut = (): SurveyMongoRepository => new SurveyMongoRepository()
describe('SurveyMongoRepository',() => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await getSurveysCollection()
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
      await insertSurveyOnDatabaseAndGetId()
      await insertSurveyOnDatabaseAndGetId()
      const sut = makeSut()
      const surveysList = await sut.loadAll()
      expect(surveysList.length).toBe(2)
      expect(surveysList[0].question).toBe('any_question')
      expect(surveysList[1].question).toBe('any_question')
      expect(surveysList[0].id).toBeTruthy()
      expect(surveysList[1].id).toBeTruthy()
    })
  })
  describe('loadById',() => {
    test('Should return null if loadById fails', async () => {
      const sut = makeSut()
      const anyId = '53cb6b9b4f4ddef1ad47f943'
      const survey = await sut.loadById(anyId)
      expect(survey).toBeFalsy()
    })
    test('Should return a survey on loadById success', async () => {
      const usedId = await insertSurveyOnDatabaseAndGetId()
      const sut = makeSut()
      const survey = await sut.loadById(usedId)
      expect(survey).toBeTruthy()
      expect(survey.id).toBeTruthy()
    })
  })
})
