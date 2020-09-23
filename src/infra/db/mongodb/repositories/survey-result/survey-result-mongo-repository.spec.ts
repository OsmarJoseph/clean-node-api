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
      const account = await insertMockAccountOnDatabase()
      const sut = makeSut()
      const surveyResultParams = {
        surveyId: survey.id,
        accountId: account.id,
        answer: survey.possibleAnswers[0].answer,
        date: new Date()
      }
      const savedSurveyResult = await sut.save({ ...surveyResultParams })
      expect(savedSurveyResult.id).toBeTruthy()
      expect(savedSurveyResult).toEqual({ ...surveyResultParams,id: savedSurveyResult.id })
    })
    test('Should update a survey result if its not new', async () => {
      const survey = await insertMockSurveyOnDatabase()
      const account = await insertMockAccountOnDatabase()
      const sut = makeSut()
      const surveyResultParams = {
        surveyId: survey.id,
        accountId: account.id,
        answer: survey.possibleAnswers[0].answer,
        date: new Date()
      }
      const updatedAnswer = survey.possibleAnswers[1].answer
      const savedMockSurveyResult = await insertMockSurveyResultOnDatabase({ ...surveyResultParams })
      const updatedSurveyResult = await sut.save(
        { ...surveyResultParams,answer: updatedAnswer }
      )
      expect(updatedSurveyResult.id).toEqual(savedMockSurveyResult.id)
      expect(updatedSurveyResult).toEqual(
        { ...surveyResultParams,id: updatedSurveyResult.id,answer: updatedAnswer }
      )
    })
  })
})
