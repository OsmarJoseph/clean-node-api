import { app } from '@/main/config/app'
import { env } from '@/main/config/env'
import { AddSurveyModel } from '@/domain/usecases/survey/add-survey'
import { AccountModel } from '@/domain/models/account'
import { AddAccountModel } from '@/domain/usecases/account/add-account'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { getAccountsCollection, AccountsCollection, getSurveysCollection, SurveysCollection } from '@/infra/db/mongodb/collections'
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

let surveyCollection: SurveysCollection
let accountCollection: AccountsCollection
const makeMockAccount = async (): Promise<AccountModel> => {
  const newAccount = makeAccountParams() as AccountModel
  const opResult = await accountCollection.insertOne(newAccount)
  return MongoHelper.map(opResult.ops[0])
}
const addValidAccessToAccount = async (account: AccountModel,withRole: boolean): Promise<string> => {
  const accessToken = sign({ id: account.id }, env.jwtSecret)
  if (withRole) {
    await accountCollection.updateOne({ _id: account.id },{ $set: { accessToken,role: 'admin' } })
  } else {
    await accountCollection.updateOne({ _id: account.id },{ $set: { accessToken } })
  }

  return accessToken
}

const insertSurveysOnDatabase = async (): Promise<void> => {
  await surveyCollection.insertMany([makeSurveyData(),makeSurveyData()])
}

describe('Survey Routes',() => {
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
  describe('POST /surveys',() => {
    test('Should return 403 on add survey without accessToken',async () => {
      await request(app).post('/api/surveys')
        .send(
          makeSurveyData()
        )
        .expect(403)
    })
    test('Should return 204 with valid accessToken',async () => {
      const mockAccount = await makeMockAccount()
      const usedAccessToken = await addValidAccessToAccount(mockAccount,true)
      await request(app).post('/api/surveys').set('x-access-token',usedAccessToken)
        .send(
          makeSurveyData()
        )
        .expect(204)
    })
    test('Should return 403 with valid accessToken and no admin role',async () => {
      const mockAccount = await makeMockAccount()
      const usedAccessToken = await addValidAccessToAccount(mockAccount,false)
      await request(app).post('/api/surveys').set('x-access-token',usedAccessToken)
        .send(
          makeSurveyData()
        )
        .expect(403)
    })
  })
  describe('GET /surveys',() => {
    test('Should return 403 on load survey without accessToken',async () => {
      await request(app).get('/api/surveys').expect(403)
    })
    test('Should return 204 on load survey with accessToken and admin role no surveys saved',async () => {
      const mockAccount = await makeMockAccount()
      const usedAccessToken = await addValidAccessToAccount(mockAccount,true)
      await
      request(app)
        .get('/api/surveys')
        .set('x-access-token',usedAccessToken)
        .expect(204)
    })
    test('Should return 204 on load survey with accessToken and no role and no surveys saved',async () => {
      const mockAccount = await makeMockAccount()
      const usedAccessToken = await addValidAccessToAccount(mockAccount,false)
      await
      request(app)
        .get('/api/surveys')
        .set('x-access-token',usedAccessToken)
        .expect(204)
    })
    test('Should return 200 on load survey with accessToken and admin role with surveys saved',async () => {
      const mockAccount = await makeMockAccount()
      const usedAccessToken = await addValidAccessToAccount(mockAccount,true)
      await insertSurveysOnDatabase()
      await
      request(app)
        .get('/api/surveys')
        .set('x-access-token',usedAccessToken)
        .expect(200)
    })
    test('Should return 200 on load survey with accessToken and no role with surveys saved',async () => {
      const mockAccount = await makeMockAccount()
      const usedAccessToken = await addValidAccessToAccount(mockAccount,false)
      await insertSurveysOnDatabase()
      await
      request(app)
        .get('/api/surveys')
        .set('x-access-token',usedAccessToken)
        .expect(200)
    })
  })
})
