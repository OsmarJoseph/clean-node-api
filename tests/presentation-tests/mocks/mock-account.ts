import { AccountModel } from '@/domain/models'
import { AddAccount, AddAccountParams , Authentication, AuthenticationParams , LoadAccountByToken } from '@/domain/usecases'
import { mockAccountModel } from '@/tests/domain-tests/mocks'
import faker from 'faker'
export class AddAccountSpy implements AddAccount {
  addAccountParams: AddAccountParams
  result = mockAccountModel()
  async add (addAccountParams: AddAccountParams): Promise<AccountModel> {
    this.addAccountParams = addAccountParams
    return this.result
  }
}

export class AuthenticationSpy implements Authentication {
  authenticationParams: AuthenticationParams
  accessToken = faker.random.uuid()
  async auth (authenticationParams: AuthenticationParams): Promise<string> {
    this.authenticationParams = authenticationParams
    return this.accessToken
  }
}

export class LoadAccountByTokenSpy implements LoadAccountByToken {
  accessToken: string
  role: string

  result = mockAccountModel()
  async loadByToken (accessToken: string,role?: string): Promise<AccountModel> {
    this.accessToken = accessToken
    this.role = role
    return this.result
  }
}
