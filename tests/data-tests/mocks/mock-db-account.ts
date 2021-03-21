import { AccountModel } from '@/domain/models'
import { AddAccountParams } from '@/domain/usecases'
import { AddAccountRepository , LoadAccountByEmailRepository , LoadAccountByTokenRepository , UpdateAccessTokenRepository } from '@/data/protocols'
import { mockAccountModel } from '@/tests/domain-tests/mocks'

export class AddAccountRepositorySpy implements AddAccountRepository {
  params: AddAccountParams
  result = mockAccountModel()

  async add (params: AddAccountParams): Promise<AccountModel> {
    this.params = params
    return this.result
  }
}
export class LoadAccountByEmailRepositorySpy implements LoadAccountByEmailRepository {
  email: string
  result = mockAccountModel()

  async loadByEmail (email: string): Promise<AccountModel> {
    this.email = email
    return this.result
  }
}

export class LoadAccountByTokenRepositorySpy implements LoadAccountByTokenRepository {
  token: string
  role: string
  result = mockAccountModel()

  async loadByToken (token: string, role?: string): Promise<AccountModel> {
    this.token = token
    this.role = role
    return this.result
  }
}

export class UpdateAccessTokenRepositorySpy implements UpdateAccessTokenRepository {
  id: string
  token: string

  async updateAccessToken (id: string, token: string): Promise<void> {
    this.id = id
    this.token = token
  }
}
