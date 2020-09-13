import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'
import { Authentication, AuthenticationModel } from '../../../domain/usecases/authentication'
import { HashComparer } from '../../protocols/criptography/hash-comparer'

export class DbAuthentication implements Authentication {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer

  ) {}

  async auth (authenticationParams: AuthenticationModel): Promise<string> {
    const { loadAccountByEmailRepository,hashComparer } = this
    const { email,password } = authenticationParams
    const account = await loadAccountByEmailRepository.load(email)
    if (account) {
      await hashComparer.compare(password,account.password)
    }
    return null
  }
}
