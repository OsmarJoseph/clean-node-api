import { SurveyResultMongoRepository } from './survey-result-mongo-repository'
import { SurveyModel } from '@/domain/models/survey'
import { AccountModel } from '@/domain/models/account'
import { SurveyResultModel } from '@/domain/models/survey-result'
import { AddSurveyModel } from '@/domain/usecases/add-survey'
import { AddAccountModel } from '@/domain/usecases/add-account'
import { SaveSurveyResultModel } from '@/domain/usecases/save-survey-result'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { Collection } from 'mongodb'

let surveyCollection: Collection
let surveyResultCollection: Collection
let accountCollection: Collection

const makeSurveyData = (): AddSurveyModel => (
  {
    question: 'any_question',
    possibleAnswers: [{
      image: 'any_image',
      answer: 'any_answer'
    },
    {
      image: 'other_image',
      answer: 'other_answer'
    }],
    date: new Date()
  }
)

const makeAccountData = (): AddAccountModel => ({
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password'
})

const insertSurveyOnDatabase = async (): Promise<SurveyModel> => {
  const survey = await surveyCollection.insertOne(makeSurveyData())
  return MongoHelper.map(survey.ops[0])
}

const insertAccountOnDatabase = async (): Promise<AccountModel> => {
  const account = await accountCollection.insertOne(makeAccountData())
  return MongoHelper.map(account.ops[0])
}

const insertSurveyResultOnDatabase = async (surveyResultData: SaveSurveyResultModel): Promise<SurveyResultModel> => {
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
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})

    surveyResultCollection = await MongoHelper.getCollection('surveyResults')
    await surveyResultCollection.deleteMany({})

    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })
  describe('save',() => {
    test('Should save a survey result if its new', async () => {
      const survey = await insertSurveyOnDatabase()
      const account = await insertAccountOnDatabase()
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
      const survey = await insertSurveyOnDatabase()
      const account = await insertAccountOnDatabase()
      const sut = makeSut()
      const surveyResultParams = {
        surveyId: survey.id,
        accountId: account.id,
        answer: survey.possibleAnswers[0].answer,
        date: new Date()
      }
      const updatedAnswer = survey.possibleAnswers[1].answer
      const savedMockSurveyResult = await insertSurveyResultOnDatabase({ ...surveyResultParams })
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
