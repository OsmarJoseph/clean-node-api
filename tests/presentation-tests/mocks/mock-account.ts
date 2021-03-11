import { AccountModel } from '@/domain/models'
import { AddAccount, AddAccountParams , Authentication, AuthenticationParams , LoadAccountByToken } from '@/domain/usecases'
import { makeMockAccountModel } from '@/tests/domain-tests/mocks'

export const makeMockAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (account: AddAccountParams): Promise<AccountModel> {
      return makeMockAccountModel()
    }
  }
  return new AddAccountStub()
}

export const makeMockAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (authenticationParams: AuthenticationParams): Promise<string> {
      return 'any_token'
    }
  }
  return new AuthenticationStub()
}

export const makeMockLoadAccountByToken = (): LoadAccountByToken => {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    async loadByToken (accessToken: string,role?: string): Promise<AccountModel> {
      return makeMockAccountModel()
    }
  }
  return new LoadAccountByTokenStub()
}
