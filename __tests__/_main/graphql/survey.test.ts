import { makeFakeApolloServer } from './helpers'
import { SurveysCollection, getSurveysCollection, AccountsCollection, getAccountsCollection } from '@/infra/db/mongodb/collections'
import { MongoHelper } from '@/infra/db/mongodb/helpers'
import {
  addValidAccessToAccount,
  insertMockAccountOnDatabase,
  insertMockSurveyOnDatabase
} from '@/tests/_infra/mocks'

import { createTestClient } from 'apollo-server-integration-testing'
import { ApolloServer, gql } from 'apollo-server-express'

let surveysCollection: SurveysCollection
let accountsCollection: AccountsCollection
let apolloServer: ApolloServer

describe('Surveys GraphQL', () => {
  beforeAll(async () => {
    apolloServer = makeFakeApolloServer()
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveysCollection = await getSurveysCollection()
    accountsCollection = await getAccountsCollection()
    await surveysCollection.deleteMany({})
    await accountsCollection.deleteMany({})
  })
  describe('Surveys Query', () => {
    const surveysQuery = gql`
    query surveys {
      surveys {
      id
      question
      possibleAnswers {
        image
        answer
      }
      date
      }
    }`

    test('Should return AccessDeniedError on load surveys without accessToken',async () => {
      const { query } = createTestClient({ apolloServer })
      const res: any = await query(surveysQuery)
      expect(res.data).toBeFalsy()
      expect(res.errors[0].message).toBe('Access denied')
    })
    test('Should return empty surveys list with accessToken and admin role but no surveys saved',async () => {
      const mockAccount = await insertMockAccountOnDatabase(accountsCollection)
      const usedAccessToken = await addValidAccessToAccount({ account: mockAccount,accountsCollection,withAdminRole: true })
      const { query } = createTestClient({ apolloServer,extendMockRequest: { headers: { 'x-acess-token': usedAccessToken } } })
      const res: any = await query(surveysQuery)
      expect(res.data).toBeFalsy()
    })

    test('Should empty sruveys list with accessToken and no role but no surveys saved',async () => {
      const mockAccount = await insertMockAccountOnDatabase(accountsCollection)
      const usedAccessToken = await addValidAccessToAccount({ account: mockAccount,accountsCollection })
      const { query } = createTestClient({ apolloServer,extendMockRequest: { headers: { 'x-acess-token': usedAccessToken } } })
      const res: any = await query(surveysQuery)
      expect(res.data).toBeFalsy()
    })
    test('Should return surveys list on load survey with accessToken and admin role with surveys saved',async () => {
      const mockAccount = await insertMockAccountOnDatabase(accountsCollection)
      const usedAccessToken = await addValidAccessToAccount({ account: mockAccount,accountsCollection,withAdminRole: true })
      const savedSurvey = await insertMockSurveyOnDatabase(surveysCollection)
      const { query } = createTestClient({ apolloServer,extendMockRequest: { headers: { 'x-access-token': usedAccessToken } } })
      const res: any = await query(surveysQuery)
      expect(res.data.surveys.length).toBe(1)
      expect(res.data.surveys[0].id).toEqual(savedSurvey.id.toString())
      expect(res.data.surveys[0].date).toEqual(savedSurvey.date.toISOString())
      expect(res.data.surveys[0].possibleAnswers).toEqual(savedSurvey.possibleAnswers)
      expect(res.data.surveys[0].question).toBe(savedSurvey.question)
    })
    test('Should surveys list on load survey with accessToken and no role with surveys saved',async () => {
      const mockAccount = await insertMockAccountOnDatabase(accountsCollection)
      const usedAccessToken = await addValidAccessToAccount({ account: mockAccount,accountsCollection })
      const savedSurvey = await insertMockSurveyOnDatabase(surveysCollection)
      const { query } = createTestClient({ apolloServer,extendMockRequest: { headers: { 'x-access-token': usedAccessToken } } })
      const res: any = await query(surveysQuery)
      expect(res.data.surveys.length).toBe(1)
      expect(res.data.surveys[0].id).toEqual(savedSurvey.id.toString())
      expect(res.data.surveys[0].date).toBe(savedSurvey.date.toISOString())
      expect(res.data.surveys[0].possibleAnswers).toEqual(savedSurvey.possibleAnswers)
      expect(res.data.surveys[0].question).toBe(savedSurvey.question)
    })
  })
})
