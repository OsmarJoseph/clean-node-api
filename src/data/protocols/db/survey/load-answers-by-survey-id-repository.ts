import { LoadAnswersBySurveyId } from '@/domain/usecases'

export interface LoadAnswersBySurveyIdRepository {
  loadAnswers: (id: string) => Promise<LoadAnswersBySurveyIdRepository.Result>
}

export namespace LoadAnswersBySurveyIdRepository {
  export type Result = LoadAnswersBySurveyId.Result
}
