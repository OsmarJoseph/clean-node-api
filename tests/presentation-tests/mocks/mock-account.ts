import { AccountModel } from '@/domain/models'
import { AddAccount, AddAccountParams , Authentication, AuthenticationParams , LoadAccountByToken } from '@/domain/usecases'
import { makeMockAccountModel } from '@/tests/domain-tests/mocks'

export class AddAccountSpy implements AddAccount {
  addAccountParams: AddAccountParams
  result = makeMockAccountModel()
  async add (addAccountParams: AddAccountParams): Promise<AccountModel> {
    this.addAccountParams = addAccountParams
    return this.result
  }
}

export class AuthenticationSpy implements Authentication {
  authenticationParams: AuthenticationParams
  result = 'any_token'
  async auth (authenticationParams: AuthenticationParams): Promise<string> {
    this.authenticationParams = authenticationParams
    return this.result
  }
}

export class LoadAccountByTokenSpy implements LoadAccountByToken {
  accessToken: string
  role: string

  result = makeMockAccountModel()
  async loadByToken (accessToken: string,role?: string): Promise<AccountModel> {
    this.accessToken = accessToken
    this.role = role
    return this.result
  }
}
