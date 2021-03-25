import { SurveyMongoRepository } from '@/infra/db/mongodb/repositories'
import { mockAddSurveyParams } from '@/tests/domain-tests/mocks'
import { MongoHelper } from '@/infra/db/mongodb/helpers'
import { getSurveysCollection, SurveysCollection } from '@/infra/db/mongodb/collections'
import { AddSurveyRepository } from '@/data/protocols'

import FakeObjectId from 'bson-objectid'

let surveyCollection: SurveysCollection

const insertMockSurveyOnDatabaseAndGetId = async (): Promise<{ id: string, surveyParams: AddSurveyRepository.Params }> => {
  const surveyParams = mockAddSurveyParams()
  const survey = await surveyCollection.insertOne(surveyParams)

  return {
    id: survey.ops[0]._id as unknown as string,
    surveyParams
  }
}

const makeSut = (): SurveyMongoRepository => new SurveyMongoRepository()
describe('SurveyMongoRepository', () => {
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
  describe('add', () => {
    test('Should create a survey on success', async () => {
      const sut = makeSut()
      await sut.add(mockAddSurveyParams())
      const savedSurvey = await surveyCollection.findOne({})
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
      const { surveyParams, id } = await insertMockSurveyOnDatabaseAndGetId()
      const { surveyParams: surveyParams1, id: id1 } = await insertMockSurveyOnDatabaseAndGetId()
      const sut = makeSut()
      const surveysList = await sut.loadAll()
      expect(surveysList.length).toBe(2)
      expect(surveysList[0].question).toBe(surveyParams.question)
      expect(surveysList[1].question).toBe(surveyParams1.question)
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
      const { id } = await insertMockSurveyOnDatabaseAndGetId()
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
      const { id } = await insertMockSurveyOnDatabaseAndGetId()
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
      const { id,surveyParams } = await insertMockSurveyOnDatabaseAndGetId()
      const sut = makeSut()
      const answers = await sut.loadAnswers(id)
      expect(answers).toEqual(surveyParams.possibleAnswers.map(({ answer }) => answer))
    })
  })
})
