import { SurveyModel } from '@/domain/models/survey'
import { AddSurveyParams } from '@/domain/usecases/survey/add-survey'

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
