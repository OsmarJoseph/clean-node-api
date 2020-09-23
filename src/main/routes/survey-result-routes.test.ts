import { AccountModel } from '@/domain/models/account'
import { makeMockAddAccountParams, makeAddSurveyParams } from '@/domain/test'
import { app } from '@/main/config/app'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { AccountsCollection, getAccountsCollection, SurveysCollection, getSurveysCollection } from '@/infra/db/mongodb/collections'
import { env } from '@/main/config/env'
import request from 'supertest'
import { sign } from 'jsonwebtoken'

let accountCollection: AccountsCollection
let surveyCollection: SurveysCollection
const insertMockAccountOnDatabase = async (): Promise<AccountModel> => {
  const opResult = await accountCollection.insertOne(makeMockAddAccountParams())
  return MongoHelper.map(opResult.ops[0])
}
const addValidAccessToAccount = async (account: AccountModel): Promise<string> => {
  const accessToken = sign({ id: account.id }, env.jwtSecret)
  await accountCollection.updateOne({ _id: account.id },{ $set: { accessToken } })
  return accessToken
}

const insertMockSurveyOnDatabase = async (): Promise<string> => {
  const survey = await surveyCollection.insertOne(makeAddSurveyParams())
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
      const mockAccount = await insertMockAccountOnDatabase()
      const usedAccessToken = await addValidAccessToAccount(mockAccount)
      const surveyId = await insertMockSurveyOnDatabase()

      await request(app)
        .put(`/api/surveys/${surveyId}/results`)
        .set('x-access-token',usedAccessToken)
        .send({
          answer: 'any_answer'
        })
        .expect(200)
    })
  })
})
