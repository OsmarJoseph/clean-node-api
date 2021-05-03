import { Authentication } from '@/domain/usecases'
import {
  LoadAccountByEmailRepository,
  HashComparer,
  Encrypter,
  UpdateAccessTokenRepository,
} from '@/data/protocols'

export class DbAuthentication implements Authentication {
  constructor(
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter,
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository,
  ) {}

  async auth(authenticationParams: Authentication.Params): Promise<Authentication.Result> {
    const {
      loadAccountByEmailRepository,
      hashComparer,
      encrypter,
      updateAccessTokenRepository,
    } = this
    const { email, password } = authenticationParams
    const account = await loadAccountByEmailRepository.loadByEmail(email)
    if (account) {
      const { password: accountPassword, id: accountId } = account
      const isValidPassword = await hashComparer.compare(password, accountPassword)
      if (isValidPassword) {
        const accessToken = await encrypter.encrypt(accountId)
        await updateAccessTokenRepository.updateAccessToken(accountId, accessToken)
        return accessToken
      }
    }
    return null
  }
}
