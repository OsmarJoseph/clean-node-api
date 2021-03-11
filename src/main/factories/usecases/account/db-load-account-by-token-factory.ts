import { DbLoadAccountByToken } from '@/data/usecases/'
import { AccountMongoRepository } from '@/infra/db/mongodb/repositories'
import { JwtAdapter } from '@/infra/criptography'
import { env } from '@/main/config/env'

export const makeLoadAccountByToken = (): DbLoadAccountByToken => {
  const jwtAdapter = new JwtAdapter(env.jwtSecret)
  const accountMongoRepository = new AccountMongoRepository()
  return new DbLoadAccountByToken(jwtAdapter,accountMongoRepository)
}
