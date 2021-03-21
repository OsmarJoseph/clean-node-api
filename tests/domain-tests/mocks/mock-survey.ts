import { SurveyModel } from '@/domain/models'
import { AddSurveyParams } from '@/domain/usecases'

import faker from 'faker'

export const mockAddSurveyParams = (): AddSurveyParams => (
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
