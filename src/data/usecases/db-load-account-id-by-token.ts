import { LoadAccountIdByToken } from '@/domain/usecases'
import { Decrypter, LoadAccountIdByTokenRepository } from '@/data/protocols'

export class DbLoadAccountIdByToken implements LoadAccountIdByToken {
  constructor (
    private readonly decrypter: Decrypter,
    private readonly loadAccountIdByTokenRepository: LoadAccountIdByTokenRepository

  ) {}

  async loadAccountIdByToken (accessToken: string,role?: string): Promise<LoadAccountIdByToken.Result> {
    let token: string
    try {
      token = await this.decrypter.decrypt(accessToken)
    } catch (error) {
      return null
    }
    if (token) {
      const accountId = await this.loadAccountIdByTokenRepository.loadAccountIdByToken(accessToken,role)
      if (accountId) return accountId
    }
    return null
  }
}
