import { makeLoadSurveyResultController, makeSaveSurveyResultController } from '@/main/factories'
import { adaptResolver } from '@/main/adapters'

export default {
  Query: {
    surveyResult: async (parent: unknown, args: unknown) => adaptResolver(makeLoadSurveyResultController(),args)
  },
  Mutation: {
    saveSurveyResult: async (parent: unknown, args: unknown) => adaptResolver(makeSaveSurveyResultController(),args)
  }
}
