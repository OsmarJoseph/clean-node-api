import { app } from '@/main/config/app'
import { MongoHelper } from '@/infra/db/mongodb/helpers'
import {
  AccountsCollection,
  getAccountsCollection,
  SurveysCollection,
  getSurveysCollection,
} from '@/infra/db/mongodb/collections'
import {
  addValidAccessToAccount,
  insertMockAccountOnDatabase,
  insertMockSurveyOnDatabase,
} from '@/tests/_infra/mocks'

import request from 'supertest'
import faker from 'faker'

let accountsCollection: AccountsCollection
let surveysCollection: SurveysCollection

describe('Survey Result Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveysCollection = await getSurveysCollection()
    await surveysCollection.deleteMany({})
    accountsCollection = await getAccountsCollection()
    await accountsCollection.deleteMany({})
  })

  describe('PUT /surveys/:surveyId/results', () => {
    test('Should return 403 on save survey result without accessToken', async () => {
      const { id: surveyId } = await insertMockSurveyOnDatabase(surveysCollection)
      await request(app)
        .put(`/api/surveys/${surveyId}/results`)
        .send({
          answer: faker.random.words(),
        })
        .expect(403)
    })
    test('Should return 200 on save survey result success', async () => {
      const mockAccount = await insertMockAccountOnDatabase(accountsCollection)
      const usedAccessToken = await addValidAccessToAccount({
        account: mockAccount,
        accountsCollection,
      })
      const {
        id: surveyId,
        possibleAnswers: [{ answer: possibleAnswer }],
      } = await insertMockSurveyOnDatabase(surveysCollection)

      await request(app)
        .put(`/api/surveys/${surveyId}/results`)
        .set('x-access-token', usedAccessToken)
        .send({
          answer: possibleAnswer,
        })
        .expect(200)
    })
  })
  describe('GET /surveys/:surveyId/results', () => {
    test('Should return 403 on load survey result without accessToken', async () => {
      const surveyId = faker.random.uuid()

      await request(app).get(`/api/surveys/${surveyId}/results`).expect(403)
    })
    test('Should return 200 on load survey result success', async () => {
      const mockAccount = await insertMockAccountOnDatabase(accountsCollection)
      const usedAccessToken = await addValidAccessToAccount({
        account: mockAccount,
        accountsCollection,
      })
      const { id: surveyId } = await insertMockSurveyOnDatabase(surveysCollection)

      await request(app)
        .get(`/api/surveys/${surveyId}/results`)
        .set('x-access-token', usedAccessToken)
        .expect(200)
    })
  })
})
