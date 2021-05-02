import { AddAccount, Authentication , LoadAccountIdByToken } from '@/domain/usecases'
import faker from 'faker'
export class AddAccountSpy implements AddAccount {
  addAccountParams: AddAccount.Params
  isValid = true
  async add (addAccountParams: AddAccount.Params): Promise<AddAccount.Result> {
    this.addAccountParams = addAccountParams
    return this.isValid
  }
}

export class AuthenticationSpy implements Authentication {
  authenticationParams: Authentication.Params
  accessToken = faker.random.uuid()
  async auth (authenticationParams: Authentication.Params): Promise<string> {
    this.authenticationParams = authenticationParams
    return this.accessToken
  }
}

export class LoadAccountIdByTokenSpy implements LoadAccountIdByToken {
  accessToken: string
  role: string

  result = faker.random.uuid()
  async loadAccountIdByToken (accessToken: string,role?: string): Promise<LoadAccountIdByToken.Result> {
    this.accessToken = accessToken
    this.role = role
    return this.result
  }
}
