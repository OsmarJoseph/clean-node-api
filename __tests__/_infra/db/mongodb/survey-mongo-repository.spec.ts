import { SurveyMongoRepository } from '@/infra/db/mongodb/repositories'
import { mockAddSurveyParams } from '@/tests/_domain/mocks'
import { MongoHelper } from '@/infra/db/mongodb/helpers'
import { getSurveysCollection, SurveysCollection } from '@/infra/db/mongodb/collections'
import { insertMockSurveyOnDatabase } from '@/tests/_infra/mocks'

import FakeObjectId from 'bson-objectid'

let surveysCollection: SurveysCollection

const makeSut = (): SurveyMongoRepository => new SurveyMongoRepository()
describe('SurveyMongoRepository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveysCollection = await getSurveysCollection()
    await surveysCollection.deleteMany({})
  })
  describe('add', () => {
    test('Should create a survey on success', async () => {
      const sut = makeSut()
      await sut.add(mockAddSurveyParams())
      const savedSurvey = await surveysCollection.findOne({})
      expect(savedSurvey).toBeTruthy()
    })
  })
  describe('loadAll', () => {
    test('Should load a empty list if db is clean', async () => {
      const sut = makeSut()
      const surveysList = await sut.loadAll()
      expect(surveysList.length).toBe(0)
    })
    test('Should load all surveys on success', async () => {
      const { question, id } = await insertMockSurveyOnDatabase(surveysCollection)
      const { question: question1, id: id1 } = await insertMockSurveyOnDatabase(surveysCollection)
      const sut = makeSut()
      const surveysList = await sut.loadAll()
      expect(surveysList.length).toBe(2)
      expect(surveysList[0].question).toBe(question)
      expect(surveysList[1].question).toBe(question1)
      expect(surveysList[0].id).toEqual(id)
      expect(surveysList[1].id).toEqual(id1)
    })
  })
  describe('loadById', () => {
    test('Should return null if survey does not exists', async () => {
      const sut = makeSut()
      const anyId = new FakeObjectId().toHexString()
      const survey = await sut.loadById(anyId)
      expect(survey).toBeFalsy()
    })
    test('Should return a survey on loadById success', async () => {
      const { id } = await insertMockSurveyOnDatabase(surveysCollection)
      const sut = makeSut()
      const survey = await sut.loadById(id)
      expect(survey).toBeTruthy()
      expect(survey.id).toEqual(id)
    })
  })
  describe('checkById', () => {
    test('Should return false if survey does not exists', async () => {
      const sut = makeSut()
      const anyId = new FakeObjectId().toHexString()
      const existsSurvey = await sut.checkById(anyId)
      expect(existsSurvey).toBe(false)
    })
    test('Should return true on checkById success', async () => {
      const { id } = await insertMockSurveyOnDatabase(surveysCollection)
      const sut = makeSut()
      const existsSurvey = await sut.checkById(id)
      expect(existsSurvey).toBe(true)
    })
  })
  describe('loadAnswers', () => {
    test('Should return empty array if survey does not exists', async () => {
      const sut = makeSut()
      const anyId = new FakeObjectId().toHexString()
      const answers = await sut.loadAnswers(anyId)
      expect(answers).toEqual([])
    })
    test('Should return answers array on loadAnswers success', async () => {
      const { id,possibleAnswers } = await insertMockSurveyOnDatabase(surveysCollection)
      const sut = makeSut()
      const answers = await sut.loadAnswers(id)
      expect(answers).toEqual(possibleAnswers.map(({ answer }) => answer))
    })
  })
})
