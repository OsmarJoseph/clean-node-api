import { Decrypter } from '../../protocols/criptography/decrypter'
import { DbLoadAccountByToken } from './db-load-account-by-token'
import { AccountModel } from '../../../domain/models/account'
import { LoadAccountByTokenRepository } from '../../../data/protocols/db/account/load-account-by-token-repository'

const makeDecrypter = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    async decrypt (value: string): Promise<string> {
      return 'any_value'
    }
  }
  return new DecrypterStub()
}
const makeMockValidAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'hashed_password'
})

const makeLoadAccountByTokenRepository = (): LoadAccountByTokenRepository => {
  class LoadAccountByTokenRepositoryStub implements LoadAccountByTokenRepository {
    async loadByToken (token: string,role?: string): Promise<AccountModel> {
      return makeMockValidAccount()
    }
  }
  return new LoadAccountByTokenRepositoryStub()
}

interface SutTypes{
  sut: DbLoadAccountByToken
  decrypterStub: Decrypter
  loadAccountByTokenRepositoryStub: LoadAccountByTokenRepository
}

const makeSut = (): SutTypes => {
  const decrypterStub = makeDecrypter()
  const loadAccountByTokenRepositoryStub = makeLoadAccountByTokenRepository()
  const sut = new DbLoadAccountByToken(decrypterStub,loadAccountByTokenRepositoryStub)
  return {
    sut,
    decrypterStub,
    loadAccountByTokenRepositoryStub
  }
}
describe('Db LoadAccount By Token Usecase', () => {
  test('Should call decrypter with correct values', async () => {
    const { sut,decrypterStub } = makeSut()
    const decryptSpy = jest.spyOn(decrypterStub,'decrypt')
    await sut.loadByToken('any_token','any_role')
    expect(decryptSpy).toHaveBeenCalledWith('any_token')
  })
  test('Should return if decrypter return null', async () => {
    const { sut,decrypterStub } = makeSut()
    jest.spyOn(decrypterStub,'decrypt').mockReturnValueOnce(new Promise(resolve => resolve(null)))
    const account = await sut.loadByToken('any_token','any_role')
    expect(account).toBeNull()
  })
  test('Should call LoadAccountByTokenRepository with correct values', async () => {
    const { sut,loadAccountByTokenRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByTokenRepositoryStub,'loadByToken')
    await sut.loadByToken('any_token','any_role')
    expect(loadSpy).toHaveBeenCalledWith('any_token','any_role')
  })
  test('Should return null if LoadAccountByTokenRepository return null', async () => {
    const { sut,loadAccountByTokenRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByTokenRepositoryStub,'loadByToken').mockReturnValueOnce(new Promise(resolve => resolve(null)))
    const account = await sut.loadByToken('any_token','any_role')
    expect(account).toBeNull()
  })
})
