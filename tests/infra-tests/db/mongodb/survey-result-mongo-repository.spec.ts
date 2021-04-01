import { SurveyResultMongoRepository } from '@/infra/db/mongodb/repositories'
import { MongoHelper } from '@/infra/db/mongodb/helpers'
import { getAccountsCollection,AccountsCollection, getSurveysCollection, SurveysCollection, getSurveyResultsCollection, SurveyResultsCollection } from '@/infra/db/mongodb/collections'
import { insertMockSurveyOnDatabase,insertMockAccountOnDatabase , insertMockSurveyResultOnDatabase } from '@/tests/infra-tests/mocks'

let surveysCollection: SurveysCollection
let surveyResultCollection: SurveyResultsCollection
let accountsCollection: AccountsCollection

const makeSut = (): SurveyResultMongoRepository => new SurveyResultMongoRepository()

describe('SurveyResultMongoRespository',() => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveysCollection = await getSurveysCollection()
    await surveysCollection.deleteMany({})

    surveyResultCollection = await getSurveyResultsCollection()
    await surveyResultCollection.deleteMany({})

    accountsCollection = await getAccountsCollection()
    await accountsCollection.deleteMany({})
  })
  describe('save',() => {
    test('Should save a survey result if its new', async () => {
      const survey = await insertMockSurveyOnDatabase(surveysCollection)
      const { id: surveyId } = survey
      const account = await insertMockAccountOnDatabase(accountsCollection)
      const { id: accountId } = account
      const sut = makeSut()
      const usedAnswer = survey.possibleAnswers[0].answer
      const surveyResultParams = {
        surveyId,
        accountId,
        answer: usedAnswer,
        date: new Date()
      }
      await sut.save({ ...surveyResultParams })
      const savedSurveyResult = await surveyResultCollection.findOne({
        surveyId,
        accountId,
        answer: usedAnswer

      })
      expect(savedSurveyResult).toBeTruthy()
    })
    test('Should update a survey result if its not new', async () => {
      const survey = await insertMockSurveyOnDatabase(surveysCollection)
      const { id: surveyId } = survey
      const account = await insertMockAccountOnDatabase(accountsCollection)
      const { id: accountId } = account
      const sut = makeSut()
      const usedAnswer = survey.possibleAnswers[1].answer
      const surveyResultParams = {
        surveyId,
        accountId,
        answer: usedAnswer,
        date: new Date()
      }
      await insertMockSurveyResultOnDatabase({ ...surveyResultParams },surveyResultCollection)
      const updatedAnswer = survey.possibleAnswers[1].answer
      await sut.save(
        { ...surveyResultParams,answer: updatedAnswer }
      )
      const updatedSurveyResult = await surveyResultCollection.find({
        surveyId,
        accountId,
        answer: updatedAnswer
      }).toArray()
      expect(updatedSurveyResult).toBeTruthy()
      expect(updatedSurveyResult.length).toBe(1)
    })
  })
  describe('loadBySurveyId', () => {
    test('should return a surveyResult on LoadBySurveyId',async () => {
      const survey = await insertMockSurveyOnDatabase(surveysCollection)
      const { id: surveyId } = survey
      const account = await insertMockAccountOnDatabase(accountsCollection)
      const sut = makeSut()
      const firstUsedAnswer = survey.possibleAnswers[0].answer
      const secondUsedAnswer = survey.possibleAnswers[1].answer
      const surveyResultParams = {
        surveyId,
        accountId: account.id,
        answer: firstUsedAnswer,
        date: new Date()
      }
      await insertMockSurveyResultOnDatabase({ ...surveyResultParams },surveyResultCollection)
      await insertMockSurveyResultOnDatabase({ ...surveyResultParams },surveyResultCollection)
      await insertMockSurveyResultOnDatabase({ ...surveyResultParams,answer: secondUsedAnswer },surveyResultCollection)
      await insertMockSurveyResultOnDatabase({ ...surveyResultParams,answer: secondUsedAnswer },surveyResultCollection)
      const loadedSurveyResult = await sut.loadBySurveyId(surveyId)
      expect(loadedSurveyResult).toBeTruthy()
      const [firstAnswer,secondAnswer] = loadedSurveyResult.answers
      expect(loadedSurveyResult.surveyId).toEqual(surveyId)
      expect(firstAnswer.answer).toBe(secondUsedAnswer)
      expect(firstAnswer.count).toBe(2)
      expect(firstAnswer.percent).toBe(50)
      expect(secondAnswer.answer).toBe(firstUsedAnswer)
      expect(secondAnswer.count).toBe(2)
      expect(secondAnswer.percent).toBe(50)
    })
    test('should return null on LoadBySurveyId if there is no survey result related to surveyId',async () => {
      const survey = await insertMockSurveyOnDatabase(surveysCollection)
      const { id: surveyId } = survey
      const sut = makeSut()
      const loadedSurveyResult = await sut.loadBySurveyId(surveyId)
      expect(loadedSurveyResult).toBeNull()
    })
  })
})
