import { AccountModel } from '@/domain/models/account'
import { AddAccountModel } from '@/domain/usecases/account/add-account'
import { AddSurveyModel } from '@/domain/usecases/survey/add-survey'
import { app } from '@/main/config/app'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { AccountsCollection, getAccountsCollection, SurveysCollection, getSurveysCollection } from '@/infra/db/mongodb/collections'
import { env } from '@/main/config/env'
import request from 'supertest'
import { sign } from 'jsonwebtoken'

const makeSurveyData = (): AddSurveyModel => (
  {
    question: 'Question 1',
    possibleAnswers: [{
      image: 'http://image-online.com',
      answer: 'Answer 1'
    }],
    date: new Date()
  }
)

const makeAccountParams = (): AddAccountModel => ({
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password'
})

let accountCollection: AccountsCollection
let surveyCollection: SurveysCollection
const makeMockAccount = async (): Promise<AccountModel> => {
  const newAccount = makeAccountParams() as AccountModel
  const opResult = await accountCollection.insertOne(newAccount)
  return MongoHelper.map(opResult.ops[0])
}
const addValidAccessToAccount = async (account: AccountModel): Promise<string> => {
  const accessToken = sign({ id: account.id }, env.jwtSecret)
  await accountCollection.updateOne({ _id: account.id },{ $set: { accessToken } })
  return accessToken
}

const insertSurveyOnDatabase = async (): Promise<string> => {
  const survey = await surveyCollection.insertOne(makeSurveyData())
  return survey.ops[0]._id as unknown as string
}

describe('Survey Result Routes',() => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await getSurveysCollection()
    await surveyCollection.deleteMany({})
    accountCollection = await getAccountsCollection()
    await accountCollection.deleteMany({})
  })

  describe('PUT /surveys/:surveyId/results',() => {
    test('Should return 403 on save survey result without accessToken',async () => {
      await request(app)
        .put('/api/surveys/any_id/results')
        .send({
          answer: 'any_answer'
        })
        .expect(403)
    })
    test('Should return 200 on save survey success',async () => {
      const mockAccount = await makeMockAccount()
      const usedAccessToken = await addValidAccessToAccount(mockAccount)
      const surveyId = await insertSurveyOnDatabase()

      await request(app)
        .put(`/api/surveys/${surveyId}/results`)
        .set('x-access-token',usedAccessToken)
        .send({
          answer: 'Answer 1'
        })
        .expect(200)
    })
  })
})
