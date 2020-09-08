import { AccountModel } from '../../../domain/models/account'
import { LoadAccountByEmailRepository } from '../../protocols/load-account-by-email-repository'
import { DbAuthentication } from './db-authentication'

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async load (email: string): Promise<AccountModel> {
      return {
        id: 'any_id',
        email: 'any_email@mail.com',
        name: 'any_name',
        password: 'any_password'
      }
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}

interface SutTypes {
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
  sut: DbAuthentication
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository()
  const sut = new DbAuthentication(loadAccountByEmailRepositoryStub)
  return {
    sut,
    loadAccountByEmailRepositoryStub
  }
}

describe('DbAuthentication UseCase',() => {
  test('Should call LoadAccountByEmailRepository with correct values',async () => {
    const { sut,loadAccountByEmailRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub,'load')
    await sut.auth({
      email: 'any_email@mail.com',
      password: 'any_password'
    })
    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com')
  })
})
