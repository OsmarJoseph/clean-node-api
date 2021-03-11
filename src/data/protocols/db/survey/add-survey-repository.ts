import { AddSurveyParams } from '@/domain/usecases'

export interface AddSurveyRepository {
  add(surveyParams: AddSurveyParams): Promise<void>
}
