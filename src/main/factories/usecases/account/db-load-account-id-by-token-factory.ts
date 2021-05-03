import { DbLoadAccountIdByToken } from '@/data/usecases/'
import { AccountMongoRepository } from '@/infra/db/mongodb/repositories'
import { JwtAdapter } from '@/infra/criptography'
import { env } from '@/main/config/env'

export const makeLoadAccountIdByToken = (): DbLoadAccountIdByToken => {
  const jwtAdapter = new JwtAdapter(env.jwtSecret)
  const accountMongoRepository = new AccountMongoRepository()
  return new DbLoadAccountIdByToken(jwtAdapter, accountMongoRepository)
}
