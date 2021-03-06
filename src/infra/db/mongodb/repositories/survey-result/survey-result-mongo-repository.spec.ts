import { SurveyResultMongoRepository } from './survey-result-mongo-repository'
import { SurveyModel } from '@/domain/models/survey'
import { AccountModel } from '@/domain/models/account'
import { SurveyResultModel } from '@/domain/models/survey-result'
import { makeMockAddAccountParams, makeAddSurveyParams } from '@/domain/test'
import { SaveSurveyResultParams } from '@/domain/usecases/survey-result/save-survey-result'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { getAccountsCollection,AccountsCollection, getSurveysCollection, SurveysCollection, getSurveyResultsCollection, SurveyResultsCollection } from '@/infra/db/mongodb/collections'

let surveyCollection: SurveysCollection
let surveyResultCollection: SurveyResultsCollection
let accountCollection: AccountsCollection

const insertMockSurveyOnDatabase = async (): Promise<SurveyModel> => {
  const survey = await surveyCollection.insertOne(makeAddSurveyParams())
  return MongoHelper.map(survey.ops[0])
}

const insertMockAccountOnDatabase = async (): Promise<AccountModel> => {
  const account = await accountCollection.insertOne(makeMockAddAccountParams())
  return MongoHelper.map(account.ops[0])
}

const insertMockSurveyResultOnDatabase = async (surveyResultData: SaveSurveyResultParams): Promise<SurveyResultModel> => {
  const savedSurveyResult = await surveyResultCollection.insertOne(surveyResultData)
  return MongoHelper.map(savedSurveyResult.ops[0])
}

const makeSut = (): SurveyResultMongoRepository => new SurveyResultMongoRepository()

describe('SurveyResultMongoRespository',() => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await getSurveysCollection()
    await surveyCollection.deleteMany({})

    surveyResultCollection = await getSurveyResultsCollection()
    await surveyResultCollection.deleteMany({})

    accountCollection = await getAccountsCollection()
    await accountCollection.deleteMany({})
  })
  describe('save',() => {
    test('Should save a survey result if its new', async () => {
      const survey = await insertMockSurveyOnDatabase()
      const { id: surveyId } = survey
      const account = await insertMockAccountOnDatabase()
      const { id: accountId } = account
      const sut = makeSut()
      const usedAnswer = survey.possibleAnswers[0].answer
      const surveyResultParams = {
        surveyId,
        accountId,
        answer: usedAnswer,
        date: new Date()
      }
      await sut.save({ ...surveyResultParams })
      const savedSurveyResult = await surveyResultCollection.findOne({
        surveyId,
        accountId,
        answer: usedAnswer

      })
      expect(savedSurveyResult).toBeTruthy()
    })
    test('Should update a survey result if its not new', async () => {
      const survey = await insertMockSurveyOnDatabase()
      const { id: surveyId } = survey
      const account = await insertMockAccountOnDatabase()
      const { id: accountId } = account
      const sut = makeSut()
      const usedAnswer = survey.possibleAnswers[1].answer
      const surveyResultParams = {
        surveyId,
        accountId,
        answer: usedAnswer,
        date: new Date()
      }
      await insertMockSurveyResultOnDatabase({ ...surveyResultParams })
      const updatedAnswer = survey.possibleAnswers[1].answer
      await sut.save(
        { ...surveyResultParams,answer: updatedAnswer }
      )
      const updatedSurveyResult = await surveyResultCollection.find({
        surveyId,
        accountId,
        answer: updatedAnswer
      }).toArray()
      expect(updatedSurveyResult).toBeTruthy()
      expect(updatedSurveyResult.length).toBe(1)
    })
  })
  describe('loadBySurveyId', () => {
    test('should return a surveyResult on LoadBySurveyId',async () => {
      const survey = await insertMockSurveyOnDatabase()
      const { id: surveyId } = survey
      const account = await insertMockAccountOnDatabase()
      const sut = makeSut()
      const firstUsedAnswer = survey.possibleAnswers[0].answer
      const secondUsedAnswer = survey.possibleAnswers[1].answer
      const surveyResultParams = {
        surveyId,
        accountId: account.id,
        answer: firstUsedAnswer,
        date: new Date()
      }
      await insertMockSurveyResultOnDatabase({ ...surveyResultParams })
      await insertMockSurveyResultOnDatabase({ ...surveyResultParams })
      await insertMockSurveyResultOnDatabase({ ...surveyResultParams,answer: secondUsedAnswer })
      await insertMockSurveyResultOnDatabase({ ...surveyResultParams,answer: secondUsedAnswer })
      const loadedSurveyResult = await sut.loadBySurveyId(surveyId)
      expect(loadedSurveyResult).toBeTruthy()
      const [firstAnswer,secondAnswer] = loadedSurveyResult.answers
      expect(loadedSurveyResult.surveyId).toEqual(surveyId)
      expect(firstAnswer.answer).toBe(secondUsedAnswer)
      expect(firstAnswer.count).toBe(2)
      expect(firstAnswer.percent).toBe(50)
      expect(secondAnswer.answer).toBe(firstUsedAnswer)
      expect(secondAnswer.count).toBe(2)
      expect(secondAnswer.percent).toBe(50)
    })
    test('should return null on LoadBySurveyId if there is no survey result related to surveyId',async () => {
      const survey = await insertMockSurveyOnDatabase()
      const { id: surveyId } = survey
      const sut = makeSut()
      const loadedSurveyResult = await sut.loadBySurveyId(surveyId)
      expect(loadedSurveyResult).toBeNull()
    })
  })
})
