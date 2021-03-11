import { app } from '@/main/config/app'
import { env } from '@/main/config/env'
import { AccountModel } from '@/domain/models'
import { makeMockAddAccountParams, makeAddSurveyParams } from '@/tests/domain-tests/mocks'
import { MongoHelper } from '@/infra/db/mongodb/helpers'
import { getAccountsCollection, AccountsCollection, getSurveysCollection, SurveysCollection } from '@/infra/db/mongodb/collections'
import request from 'supertest'
import { sign } from 'jsonwebtoken'

let surveyCollection: SurveysCollection
let accountCollection: AccountsCollection
const insertMockAccountOnDatabase = async (): Promise<AccountModel> => {
  const newAccount = makeMockAddAccountParams() as AccountModel
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

const insertMockSurveysOnDatabase = async (): Promise<void> => {
  await surveyCollection.insertMany([makeAddSurveyParams(),makeAddSurveyParams()])
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
          makeAddSurveyParams()
        )
        .expect(403)
    })
    test('Should return 204 with valid accessToken',async () => {
      const mockAccount = await insertMockAccountOnDatabase()
      const usedAccessToken = await addValidAccessToAccount(mockAccount,true)
      await request(app).post('/api/surveys').set('x-access-token',usedAccessToken)
        .send(
          makeAddSurveyParams()
        )
        .expect(204)
    })
    test('Should return 403 with valid accessToken and no admin role',async () => {
      const mockAccount = await insertMockAccountOnDatabase()
      const usedAccessToken = await addValidAccessToAccount(mockAccount,false)
      await request(app).post('/api/surveys').set('x-access-token',usedAccessToken)
        .send(
          makeAddSurveyParams()
        )
        .expect(403)
    })
  })
  describe('GET /surveys',() => {
    test('Should return 403 on load survey without accessToken',async () => {
      await request(app).get('/api/surveys').expect(403)
    })
    test('Should return 204 on load survey with accessToken and admin role no surveys saved',async () => {
      const mockAccount = await insertMockAccountOnDatabase()
      const usedAccessToken = await addValidAccessToAccount(mockAccount,true)
      await
      request(app)
        .get('/api/surveys')
        .set('x-access-token',usedAccessToken)
        .expect(204)
    })
    test('Should return 204 on load survey with accessToken and no role and no surveys saved',async () => {
      const mockAccount = await insertMockAccountOnDatabase()
      const usedAccessToken = await addValidAccessToAccount(mockAccount,false)
      await
      request(app)
        .get('/api/surveys')
        .set('x-access-token',usedAccessToken)
        .expect(204)
    })
    test('Should return 200 on load survey with accessToken and admin role with surveys saved',async () => {
      const mockAccount = await insertMockAccountOnDatabase()
      const usedAccessToken = await addValidAccessToAccount(mockAccount,true)
      await insertMockSurveysOnDatabase()
      await
      request(app)
        .get('/api/surveys')
        .set('x-access-token',usedAccessToken)
        .expect(200)
    })
    test('Should return 200 on load survey with accessToken and no role with surveys saved',async () => {
      const mockAccount = await insertMockAccountOnDatabase()
      const usedAccessToken = await addValidAccessToAccount(mockAccount,false)
      await insertMockSurveysOnDatabase()
      await
      request(app)
        .get('/api/surveys')
        .set('x-access-token',usedAccessToken)
        .expect(200)
    })
  })
})
