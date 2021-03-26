import { makeLoginControlller, makeSignUpController } from '@/main/factories'
import { adaptResolver } from '@/main/adapters'

export default {
  Query: {
    login: async (parent: unknown, args: unknown) => adaptResolver(makeLoginControlller(),args)
  },
  Mutation: {
    signUp: async (parent: unknown, args: unknown) => adaptResolver(makeSignUpController(),args)
  }
}
