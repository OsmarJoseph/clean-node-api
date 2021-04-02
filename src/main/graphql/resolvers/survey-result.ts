import { makeLoadSurveyResultController, makeSaveSurveyResultController } from '@/main/factories'
import { adaptResolver } from '@/main/adapters'

export default {
  Query: {
    surveyResult: async (parent: unknown, args: unknown,context: any) => adaptResolver(makeLoadSurveyResultController(),args,context)
  },
  Mutation: {
    saveSurveyResult: async (parent: unknown, args: unknown,context: any) => adaptResolver(makeSaveSurveyResultController(),args,context)
  }
}
