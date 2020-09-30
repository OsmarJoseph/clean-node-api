import { DbLoadAccountByToken } from './db-load-account-by-token'
import { Decrypter,LoadAccountByTokenRepository } from './db-load-account-by-token-protocols'
import { throwError, makeMockAccountModel } from '@/domain/test'
import { makeMockDecrypter,makeMockLoadAccountByTokenRepository } from '@/data/test'

type SutTypes = {
  sut: DbLoadAccountByToken
  decrypterStub: Decrypter
  loadAccountByTokenRepositoryStub: LoadAccountByTokenRepository
}

const makeSut = (): SutTypes => {
  const decrypterStub = makeMockDecrypter()
  const loadAccountByTokenRepositoryStub = makeMockLoadAccountByTokenRepository()
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
    jest.spyOn(decrypterStub,'decrypt').mockReturnValueOnce(Promise.resolve(null))
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
    jest.spyOn(loadAccountByTokenRepositoryStub,'loadByToken').mockReturnValueOnce(Promise.resolve(null))
    const account = await sut.loadByToken('any_token','any_role')
    expect(account).toBeNull()
  })
  test('Should return an account on success', async () => {
    const { sut } = makeSut()
    const account = await sut.loadByToken('any_token','any_role')
    expect(account).toEqual(makeMockAccountModel())
  })
  test('Should return null if Decrypter throws', async () => {
    const { sut,decrypterStub } = makeSut()
    jest.spyOn(decrypterStub,'decrypt').mockImplementationOnce(throwError)
    const account = await sut.loadByToken('any_token','any_role')
    expect(account).toBeNull()
  })
  test('Should throw if LoadAccountByTokenRepository throws', async () => {
    const { sut,loadAccountByTokenRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByTokenRepositoryStub,'loadByToken').mockImplementationOnce(throwError)
    const accountPromise = sut.loadByToken('any_token','any_role')
    await expect(accountPromise).rejects.toThrow()
  })
})
