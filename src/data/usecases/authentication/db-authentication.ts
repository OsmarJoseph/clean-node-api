import {
  LoadAccountByEmailRepository,
  Authentication,
  AuthenticationModel,
  HashComparer,
  TokenGenerator,
  UpdateAccessTokenRepository
} from './db-authentication-protocols'

export class DbAuthentication implements Authentication {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly tokenGenerator: TokenGenerator,
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository
  ) {}

  async auth (authenticationParams: AuthenticationModel): Promise<string> {
    const { loadAccountByEmailRepository, hashComparer,tokenGenerator,updateAccessTokenRepository } = this
    const { email,password } = authenticationParams
    const account = await loadAccountByEmailRepository.load(email)
    if (account) {
      const { password: accountPassword,id: accountId } = account
      const isValidPassword = await hashComparer.compare(password,accountPassword)
      if (isValidPassword) {
        const accessToken = await tokenGenerator.generate(accountId)
        await updateAccessTokenRepository.update(accountId,accessToken)
        return accessToken
      }
    }
    return null
  }
}
