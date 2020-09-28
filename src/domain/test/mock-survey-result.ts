import { SurveyResultModel } from '@/domain/models/survey-result'
import { SaveSurveyResultParams } from '@/domain/usecases/survey-result/save-survey-result'

export const makeSaveSurveyResultParams = (): SaveSurveyResultParams => ({
  surveyId: 'any_survey_id',
  accountId: 'any_account_id',
  answer: 'any_answer',
  date: new Date()
})

export const makeMockSurveyResultModel = (): SurveyResultModel => (
  {
    surveyId: 'any_survey_id',
    question: 'any_question',
    answers: [
      {
        image: 'any_image',
        answer: 'any_answer',
        count: 1,
        percent: 50
      },
      {
        image: 'other_image',
        answer: 'other_answer',
        count: 1,
        percent: 50
      }
    ],
    date: new Date()
  }
)
