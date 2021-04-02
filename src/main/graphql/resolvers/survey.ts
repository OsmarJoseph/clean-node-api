import { adaptResolver } from '@/main/adapters'
import { makeLoadSurveysController } from '@/main/factories'

export default {
  Query: {
    surveys: async (parent: unknown, args: unknown,context: any) => adaptResolver(makeLoadSurveysController(),args,context)
  }
}
