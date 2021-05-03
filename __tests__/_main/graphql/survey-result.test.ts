import { makeFakeApolloServer } from './helpers'
import {
  SurveysCollection,
  getSurveysCollection,
  AccountsCollection,
  getAccountsCollection,
} from '@/infra/db/mongodb/collections'
import { MongoHelper } from '@/infra/db/mongodb/helpers'
import {
  addValidAccessToAccount,
  insertMockAccountOnDatabase,
  insertMockSurveyOnDatabase,
} from '@/tests/_infra/mocks'

import { createTestClient } from 'apollo-server-integration-testing'
import { ApolloServer, gql } from 'apollo-server-express'

let surveysCollection: SurveysCollection
let accountsCollection: AccountsCollection
let apolloServer: ApolloServer

describe('SurveyResults GraphQL', () => {
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
  describe('SurveyResult Query', () => {
    const surveyResult = gql`
      query surveyResult($surveyId: String!) {
        surveyResult(surveyId: $surveyId) {
          question
          answers {
            answer
            image
            count
            percent
          }
          date
        }
      }
    `

    test('Should return AccessDeniedError on load surveys without accessToken', async () => {
      const savedSurvey = await insertMockSurveyOnDatabase(surveysCollection)
      const { query } = createTestClient({ apolloServer })
      const res: any = await query(surveyResult, {
        variables: { surveyId: savedSurvey.id.toString() },
      })
      expect(res.data).toBeFalsy()
      expect(res.errors[0].message).toBe('Access denied')
    })
    test('Should return valid survey result', async () => {
      const mockAccount = await insertMockAccountOnDatabase(accountsCollection)
      const usedAccessToken = await addValidAccessToAccount({
        account: mockAccount,
        accountsCollection,
      })
      const savedSurvey = await insertMockSurveyOnDatabase(surveysCollection)
      const { query } = createTestClient({
        apolloServer,
        extendMockRequest: { headers: { 'x-access-token': usedAccessToken } },
      })
      const res: any = await query(surveyResult, {
        variables: { surveyId: savedSurvey.id.toString() },
      })
      const answerObject = savedSurvey.possibleAnswers[0]
      expect(res.data.surveyResult.question).toBe(savedSurvey.question)
      expect(res.data.surveyResult.answers[0]).toEqual({
        answer: answerObject.answer,
        image: answerObject.image,
        count: 0,
        percent: 0,
      })
      expect(res.data.surveyResult.date).toBe(savedSurvey.date.toISOString())
    })
  })
  describe('SaveSurveyResult Mutation', () => {
    const saveSurveyResult = gql`
      mutation saveSurveyResult($surveyId: String!, $answer: String!) {
        saveSurveyResult(surveyId: $surveyId, answer: $answer) {
          question
          answers {
            answer
            image
            count
            percent
          }
          date
        }
      }
    `

    test('Should return AccessDeniedError on load surveys without accessToken', async () => {
      const savedSurvey = await insertMockSurveyOnDatabase(surveysCollection)
      const { mutate } = createTestClient({ apolloServer })
      const {
        id: surveyId,
        possibleAnswers: [{ answer }],
      } = savedSurvey
      const res: any = await mutate(saveSurveyResult, {
        variables: { surveyId: surveyId.toString(), answer },
      })
      expect(res.data).toBeFalsy()
      expect(res.errors[0].message).toBe('Access denied')
    })
    test('Should save survey result', async () => {
      const mockAccount = await insertMockAccountOnDatabase(accountsCollection)
      const usedAccessToken = await addValidAccessToAccount({
        account: mockAccount,
        accountsCollection,
      })
      const savedSurvey = await insertMockSurveyOnDatabase(surveysCollection)
      const { mutate } = createTestClient({
        apolloServer,
        extendMockRequest: { headers: { 'x-access-token': usedAccessToken } },
      })
      const {
        id: surveyId,
        possibleAnswers: [{ answer }],
      } = savedSurvey
      const res: any = await mutate(saveSurveyResult, {
        variables: { surveyId: surveyId.toString(), answer },
      })
      const answerObject = savedSurvey.possibleAnswers[0]
      expect(res.data.saveSurveyResult.question).toBe(savedSurvey.question)
      expect(res.data.saveSurveyResult.answers[0]).toEqual({
        answer: answerObject.answer,
        image: answerObject.image,
        count: 1,
        percent: 100,
      })
      expect(res.data.saveSurveyResult.date).toBe(savedSurvey.date.toISOString())
    })
  })
})
