import request from 'supertest'
import { app } from '../config/app'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import { AddSurveyModel } from '../../domain/usecases/add-survey'
import { Collection } from 'mongodb'
const makeSurveyData = (): AddSurveyModel => (
  {
    question: 'Question 1',
    possibleAnswers: [{
      image: 'http://image-online.com',
      answer: 'Answer 1'
    }]
  }
)
let surveyCollection: Collection
describe('Survey Routes',() => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
  })
  describe('POST /surveys',() => {
    test('Should return 403 on add survey without accessToken',async () => {
      await request(app).post('/api/surveys')
        .send(
          makeSurveyData()
        )
        .expect(403)
    })
  })
})
