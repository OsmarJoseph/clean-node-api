import { app } from '@/main/config/app'
import { mockAddSurveyParams } from '@/tests/domain-tests/mocks'
import { MongoHelper } from '@/infra/db/mongodb/helpers'
import { getAccountsCollection, AccountsCollection, getSurveysCollection, SurveysCollection } from '@/infra/db/mongodb/collections'
import { addValidAccessToAccount, insertMockAccountOnDatabase, insertMockSurveyOnDatabase } from '@/tests/infra-tests/mocks'
import request from 'supertest'

let surveysCollection: SurveysCollection
let accountCollection: AccountsCollection

describe('Survey Routes',() => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveysCollection = await getSurveysCollection()
    await surveysCollection.deleteMany({})
    accountCollection = await getAccountsCollection()
    await accountCollection.deleteMany({})
  })
  describe('POST /surveys',() => {
    test('Should return 403 on add survey without accessToken',async () => {
      await request(app).post('/api/surveys')
        .send(
          mockAddSurveyParams()
        )
        .expect(403)
    })
    test('Should return 204 with valid accessToken',async () => {
      const mockAccount = await insertMockAccountOnDatabase(accountCollection)
      const usedAccessToken = await addValidAccessToAccount({ account: mockAccount,accountCollection,withAdminRole: true })
      await request(app).post('/api/surveys').set('x-access-token',usedAccessToken)
        .send(
          mockAddSurveyParams()
        )
        .expect(204)
    })
    test('Should return 403 with valid accessToken and no admin role',async () => {
      const mockAccount = await insertMockAccountOnDatabase(accountCollection)
      const usedAccessToken = await addValidAccessToAccount({ account: mockAccount,accountCollection })
      await request(app).post('/api/surveys').set('x-access-token',usedAccessToken)
        .send(
          mockAddSurveyParams()
        )
        .expect(403)
    })
  })
  describe('GET /surveys',() => {
    test('Should return 403 on load survey without accessToken',async () => {
      await request(app).get('/api/surveys').expect(403)
    })
    test('Should return 204 on load survey with accessToken and admin role no surveys saved',async () => {
      const mockAccount = await insertMockAccountOnDatabase(accountCollection)
      const usedAccessToken = await addValidAccessToAccount({ account: mockAccount,accountCollection,withAdminRole: true })
      await
      request(app)
        .get('/api/surveys')
        .set('x-access-token',usedAccessToken)
        .expect(204)
    })
    test('Should return 204 on load survey with accessToken and no role and no surveys saved',async () => {
      const mockAccount = await insertMockAccountOnDatabase(accountCollection)
      const usedAccessToken = await addValidAccessToAccount({ account: mockAccount,accountCollection })
      await
      request(app)
        .get('/api/surveys')
        .set('x-access-token',usedAccessToken)
        .expect(204)
    })
    test('Should return 200 on load survey with accessToken and admin role with surveys saved',async () => {
      const mockAccount = await insertMockAccountOnDatabase(accountCollection)
      const usedAccessToken = await addValidAccessToAccount({ account: mockAccount,accountCollection, withAdminRole: true })
      await insertMockSurveyOnDatabase(surveysCollection)
      await
      request(app)
        .get('/api/surveys')
        .set('x-access-token',usedAccessToken)
        .expect(200)
    })
    test('Should return 200 on load survey with accessToken and no role with surveys saved',async () => {
      const mockAccount = await insertMockAccountOnDatabase(accountCollection)
      const usedAccessToken = await addValidAccessToAccount({ account: mockAccount,accountCollection })
      await insertMockSurveyOnDatabase(surveysCollection)
      await
      request(app)
        .get('/api/surveys')
        .set('x-access-token',usedAccessToken)
        .expect(200)
    })
  })
})
