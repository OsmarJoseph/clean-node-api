import { AccountModel } from '@/domain/models'
import { AddAccountRepository , LoadAccountByEmailRepository , LoadAccountIdByTokenRepository , UpdateAccessTokenRepository } from '@/data/protocols'
import { mockAccountModel } from '@/tests/domain-tests/mocks'

import faker from 'faker'

export class AddAccountRepositorySpy implements AddAccountRepository {
  params: AddAccountRepository.Params
  result = mockAccountModel()

  async add (params: AddAccountRepository.Params): Promise<AccountModel> {
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

export class LoadAccountIdByTokenRepositorySpy implements LoadAccountIdByTokenRepository {
  token: string
  role: string
  result = faker.random.uuid()

  async loadAccountIdByToken (token: string, role?: string): Promise<LoadAccountIdByTokenRepository.Result> {
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
