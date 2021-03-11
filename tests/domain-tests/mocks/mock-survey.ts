import { SurveyModel } from '@/domain/models'
import { AddSurveyParams } from '@/domain/usecases'

export const makeAddSurveyParams = (): AddSurveyParams => (
  {
    question: 'any_question',
    possibleAnswers: [{
      image: 'any_image',
      answer: 'any_answer'
    },
    {
      image: 'other_image',
      answer: 'other_answer'
    }],
    date: new Date()
  }
)

export const makeMockSurveyModel = (): SurveyModel => (
  {
    id: 'any_survey_id',
    ...makeAddSurveyParams()
  }
)
export const makeMockSurveysModelList = (): SurveyModel[] => [
  makeMockSurveyModel(),makeMockSurveyModel()
]
