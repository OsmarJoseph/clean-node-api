import { SurveyModel } from '@/domain/models'

export interface AddSurvey {
  add: (surveyParams: AddSurvey.Params) => Promise<void>
}

export namespace AddSurvey {
  export type Params = Omit<SurveyModel,'id'>
}
