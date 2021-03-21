import { AccountModel } from '@/domain/models'
import { mockAddAccountParams, mockAddSurveyParams } from '@/tests/domain-tests/mocks'
import { app } from '@/main/config/app'
import { env } from '@/main/config/env'
import { MongoHelper } from '@/infra/db/mongodb/helpers'
import { AccountsCollection, getAccountsCollection, SurveysCollection, getSurveysCollection } from '@/infra/db/mongodb/collections'

import request from 'supertest'
import faker from 'faker'
import { sign } from 'jsonwebtoken'

let accountCollection: AccountsCollection
let surveyCollection: SurveysCollection
const insertMockAccountOnDatabase = async (): Promise<AccountModel> => {
  const opResult = await accountCollection.insertOne(mockAddAccountParams())
  return MongoHelper.map(opResult.ops[0])
}
const addValidAccessToAccount = async (account: AccountModel): Promise<string> => {
  const accessToken = sign({ id: account.id }, env.jwtSecret)
  await accountCollection.updateOne({ _id: account.id },{ $set: { accessToken } })
  return accessToken
}

const insertMockSurveyOnDatabase = async (): Promise<{
  surveyId: string
  possibleAnswer: string
}> => {
  const surveyParams = mockAddSurveyParams()
  const survey = await surveyCollection.insertOne(surveyParams)
  return {
    surveyId: survey.ops[0]._id as unknown as string,
    possibleAnswer: surveyParams.possibleAnswers[0].answer
  }
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
      const { surveyId } = await insertMockSurveyOnDatabase()
      await request(app)
        .put(`/api/surveys/${surveyId}/results`)
        .send({
          answer: faker.random.words()
        })
        .expect(403)
    })
    test('Should return 200 on save survey result success',async () => {
      const mockAccount = await insertMockAccountOnDatabase()
      const usedAccessToken = await addValidAccessToAccount(mockAccount)
      const { surveyId,possibleAnswer } = await insertMockSurveyOnDatabase()

      await request(app)
        .put(`/api/surveys/${surveyId}/results`)
        .set('x-access-token',usedAccessToken)
        .send({
          answer: possibleAnswer
        })
        .expect(200)
    })
  })
  describe('GET /surveys/:surveyId/results',() => {
    test('Should return 403 on load survey result without accessToken',async () => {
      const surveyId = faker.random.uuid()

      await request(app)
        .get(`/api/surveys/${surveyId}/results`)
        .expect(403)
    })
    test('Should return 200 on load survey result success',async () => {
      const mockAccount = await insertMockAccountOnDatabase()
      const usedAccessToken = await addValidAccessToAccount(mockAccount)
      const { surveyId } = await insertMockSurveyOnDatabase()

      await request(app)
        .get(`/api/surveys/${surveyId}/results`)
        .set('x-access-token',usedAccessToken)
        .expect(200)
    })
  })
})
