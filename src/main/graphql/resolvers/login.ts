import { makeLoginControlller } from '@/main/factories'
import { adaptResolver } from '@/main/adapters'

export default {
  Query: {
    login: async (parent: unknown, args: unknown) => adaptResolver(makeLoginControlller(),args)
  }
}
