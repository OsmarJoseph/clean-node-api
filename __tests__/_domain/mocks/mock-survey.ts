import { SurveyModel } from '@/domain/models'
import { AddSurvey } from '@/domain/usecases'

import faker from 'faker'

export const mockAddSurveyParams = (): AddSurvey.Params => (
  {
    question: faker.random.words(),
    possibleAnswers: [{
      image: faker.image.imageUrl(),
      answer: faker.random.word()
    },
    {
      image: faker.image.imageUrl(),
      answer: faker.random.word()
    }],
    date: faker.date.recent()
  }
)

export const mockSurveyModel = (): SurveyModel => (
  {
    id: faker.random.uuid(),
    ...mockAddSurveyParams()
  }
)
export const mockSurveysModelList = (): SurveyModel[] => [
  mockSurveyModel(),mockSurveyModel()
]
