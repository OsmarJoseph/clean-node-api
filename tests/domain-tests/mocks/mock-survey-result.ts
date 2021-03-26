import { SurveyResultModel } from '@/domain/models'
import { SaveSurveyResult } from '@/domain/usecases'

import faker from 'faker'

export const mockSaveSurveyResultParams = (): SaveSurveyResult.Params => ({
  surveyId: faker.random.uuid(),
  accountId: faker.random.uuid(),
  answer: faker.random.word(),
  date: faker.date.recent()
})

export const mockSurveyResultModel = (): SurveyResultModel => (
  {
    surveyId: faker.random.uuid(),
    question: faker.random.word(),
    answers: [
      {
        image: faker.image.imageUrl(),
        answer: faker.random.word(),
        count: faker.random.number({ min: 0, max: 1000 }),
        percent: faker.random.number({ min: 0, max: 100 })
      },
      {
        image: faker.image.imageUrl(),
        answer: faker.random.word(),
        count: faker.random.number({ min: 0, max: 1000 }),
        percent: faker.random.number({ min: 0, max: 100 })
      }
    ],
    date: faker.date.recent()
  }
)
