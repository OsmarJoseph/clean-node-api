import { DbAuthentication } from './db-authentication'
import {
  LoadAccountByEmailRepository,
  HashComparer,
  Encrypter,
  UpdateAccessTokenRepository
} from './db-authentication-protocols'
import { throwError, makeMockAuthenticationParams } from '@/domain/test'
import { makeMockHashComparer, makeMockEncrypter, makeMockLoadAccountByEmailRepository, makeMockUpdateAccessTokenRepository } from '@/data/test'

type SutTypes = {
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
  sut: DbAuthentication
  hashComparerStub: HashComparer
  encrypterStub: Encrypter
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepository
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = makeMockLoadAccountByEmailRepository()
  const hashComparerStub = makeMockHashComparer()
  const encrypterStub = makeMockEncrypter()
  const updateAccessTokenRepositoryStub = makeMockUpdateAccessTokenRepository()

  const sut = new DbAuthentication(
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    encrypterStub,
    updateAccessTokenRepositoryStub
  )
  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    encrypterStub,
    updateAccessTokenRepositoryStub
  }
}

describe('DbAuthentication UseCase',() => {
  test('Should call LoadAccountByEmailRepository with correct values',async () => {
    const { sut,loadAccountByEmailRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub,'loadByEmail')
    await sut.auth(makeMockAuthenticationParams())
    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com')
  })
  test('Should throw if LoadAccountByEmailRepository throws',async () => {
    const { sut,loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub,'loadByEmail').mockImplementationOnce(throwError)
    const authPromise = sut.auth(makeMockAuthenticationParams())
    await expect(authPromise).rejects.toThrow()
  })
  test('Should return null if LoadAccountByEmailRepository returns null',async () => {
    const { sut,loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub,'loadByEmail').mockReturnValueOnce(null)
    const accessToken = await sut.auth(makeMockAuthenticationParams())
    expect(accessToken).toBeNull()
  })
  test('Should call HashComparer with correct password',async () => {
    const { sut,hashComparerStub } = makeSut()
    const compareSpy = jest.spyOn(hashComparerStub,'compare')
    await sut.auth(makeMockAuthenticationParams())
    expect(compareSpy).toHaveBeenCalledWith('any_password','any_password')
  })
  test('Should throw if HashComparer throws',async () => {
    const { sut,hashComparerStub } = makeSut()
    jest.spyOn(hashComparerStub,'compare').mockImplementationOnce(throwError)
    const authPromise = sut.auth(makeMockAuthenticationParams())
    await expect(authPromise).rejects.toThrow()
  })
  test('Should call HashComparer with correct password',async () => {
    const { sut,hashComparerStub } = makeSut()
    const compareSpy = jest.spyOn(hashComparerStub,'compare')
    await sut.auth(makeMockAuthenticationParams())
    expect(compareSpy).toHaveBeenCalledWith('any_password','any_password')
  })
  test('Should return null if HashComparer returns false',async () => {
    const { sut,hashComparerStub } = makeSut()
    jest.spyOn(hashComparerStub,'compare').mockReturnValueOnce(Promise.resolve(false))
    const accessToken = await sut.auth(makeMockAuthenticationParams())
    expect(accessToken).toBeNull()
  })
  test('Should calls Encrypter with correct id',async () => {
    const { sut,encrypterStub } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub,'encrypt')
    await sut.auth(makeMockAuthenticationParams())
    expect(encryptSpy).toHaveBeenCalledWith('any_id')
  })
  test('Should throw if Encrypter throws',async () => {
    const { sut,encrypterStub } = makeSut()
    jest.spyOn(encrypterStub,'encrypt').mockImplementationOnce(throwError)
    const authPromise = sut.auth(makeMockAuthenticationParams())
    await expect(authPromise).rejects.toThrow()
  })
  test('Should return a token on success',async () => {
    const { sut } = makeSut()
    const accessToken = await sut.auth(makeMockAuthenticationParams())
    expect(accessToken).toBe('any_token')
  })
  test('Should calls UpdateAccessTokenRepository with correct values',async () => {
    const { sut,updateAccessTokenRepositoryStub } = makeSut()
    const updateSpy = jest.spyOn(updateAccessTokenRepositoryStub,'updateAccessToken')
    await sut.auth(makeMockAuthenticationParams())
    expect(updateSpy).toHaveBeenCalledWith('any_id','any_token')
  })
  test('Should throw if UpdateAccessTokenRepository throws',async () => {
    const { sut,updateAccessTokenRepositoryStub } = makeSut()
    jest.spyOn(updateAccessTokenRepositoryStub,'updateAccessToken').mockImplementationOnce(throwError)
    const authPromise = sut.auth(makeMockAuthenticationParams())
    await expect(authPromise).rejects.toThrow()
  })
})
