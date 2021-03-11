import { AccountModel } from '@/domain/models'
import { AddAccountParams } from '@/domain/usecases'
import { AddAccountRepository , LoadAccountByEmailRepository , LoadAccountByTokenRepository , UpdateAccessTokenRepository } from '@/data/protocols'
import { makeMockAccountModel } from '@/tests/domain-tests/mocks'

export const makeMockAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add (account: AddAccountParams): Promise<AccountModel> {
      return makeMockAccountModel()
    }
  }
  return new AddAccountRepositoryStub()
}
export const makeMockLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async loadByEmail (email: string): Promise<AccountModel> {
      return makeMockAccountModel()
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}

export const makeMockLoadAccountByTokenRepository = (): LoadAccountByTokenRepository => {
  class LoadAccountByTokenRepositoryStub implements LoadAccountByTokenRepository {
    async loadByToken (token: string,role?: string): Promise<AccountModel> {
      return makeMockAccountModel()
    }
  }
  return new LoadAccountByTokenRepositoryStub()
}

export const makeMockUpdateAccessTokenRepository = (): UpdateAccessTokenRepository => {
  class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
    async updateAccessToken (userId: string,token: string): Promise<void> {}
  }
  return new UpdateAccessTokenRepositoryStub()
}
