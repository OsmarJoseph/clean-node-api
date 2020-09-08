import { LoadAccountByEmailRepository } from '../../protocols/load-account-by-email-repository'
import { Authentication, AuthenticationModel } from '../../../domain/usecases/authentication'

export class DbAuthentication implements Authentication {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  ) {}

  async auth (authenticationParams: AuthenticationModel): Promise<string> {
    const { loadAccountByEmailRepository } = this
    const { email } = authenticationParams
    await loadAccountByEmailRepository.load(email)
    return null
  }
}
