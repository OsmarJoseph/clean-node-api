import { makeLoginControlller, makeSignUpController } from '@/main/factories'
import { adaptResolver } from '@/main/adapters'

export default {
  Query: {
    login: async (parent: unknown, args: unknown, context: any) =>
      adaptResolver(makeLoginControlller(), args, context),
  },
  Mutation: {
    signUp: async (parent: unknown, args: unknown, context: any) =>
      adaptResolver(makeSignUpController(), args, context),
  },
}
