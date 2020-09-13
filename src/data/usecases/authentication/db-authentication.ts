import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'
import { Authentication, AuthenticationModel } from '../../../domain/usecases/authentication'
import { HashComparer } from '../../protocols/criptography/hash-comparer'
import { TokenGenerator } from '../../protocols/criptography/token-generator'

export class DbAuthentication implements Authentication {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly tokenGenerator: TokenGenerator
  ) {}

  async auth (authenticationParams: AuthenticationModel): Promise<string> {
    const { loadAccountByEmailRepository, hashComparer,tokenGenerator } = this
    const { email,password } = authenticationParams
    const account = await loadAccountByEmailRepository.load(email)
    if (account) {
      const { password: accountPassword,id: accountId } = account
      const isValidPassword = await hashComparer.compare(password,accountPassword)
      if (isValidPassword) {
        const accessToken = await tokenGenerator.generate(accountId)
        return accessToken
      }
    }
    return null
  }
}
