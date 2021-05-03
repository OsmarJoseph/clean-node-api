import { mockAuthenticationParams } from '@/tests/_domain/mocks'
import { DbAuthentication } from '@/data/usecases'
import {
  HashComparerSpy,
  EncrypterSpy,
  UpdateAccessTokenRepositorySpy,
  LoadAccountByEmailRepositorySpy,
} from '@/tests/_data/mocks'
import { throwError } from '@/tests/_helpers'

type SutTypes = {
  loadAccountByEmailRepositorySpy: LoadAccountByEmailRepositorySpy
  sut: DbAuthentication
  hashComparerSpy: HashComparerSpy
  encrypterSpy: EncrypterSpy
  updateAccessTokenRepositorySpy: UpdateAccessTokenRepositorySpy
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositorySpy = new LoadAccountByEmailRepositorySpy()
  const hashComparerSpy = new HashComparerSpy()
  const encrypterSpy = new EncrypterSpy()
  const updateAccessTokenRepositorySpy = new UpdateAccessTokenRepositorySpy()

  const sut = new DbAuthentication(
    loadAccountByEmailRepositorySpy,
    hashComparerSpy,
    encrypterSpy,
    updateAccessTokenRepositorySpy,
  )
  return {
    sut,
    loadAccountByEmailRepositorySpy,
    hashComparerSpy,
    encrypterSpy,
    updateAccessTokenRepositorySpy,
  }
}

describe('DbAuthentication UseCase', () => {
  let mockedAuthenticationParams = mockAuthenticationParams()
  beforeEach(() => {
    mockedAuthenticationParams = mockAuthenticationParams()
  })
  test('Should call LoadAccountByEmailRepository with correct values', async () => {
    const { sut, loadAccountByEmailRepositorySpy } = makeSut()
    await sut.auth(mockedAuthenticationParams)
    expect(loadAccountByEmailRepositorySpy.email).toBe(mockedAuthenticationParams.email)
  })
  test('Should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositorySpy } = makeSut()
    loadAccountByEmailRepositorySpy.loadByEmail = throwError
    const authPromise = sut.auth(mockedAuthenticationParams)
    await expect(authPromise).rejects.toThrow()
  })
  test('Should return null if LoadAccountByEmailRepository returns null', async () => {
    const { sut, loadAccountByEmailRepositorySpy } = makeSut()
    loadAccountByEmailRepositorySpy.result = null
    const accessToken = await sut.auth(mockedAuthenticationParams)
    expect(accessToken).toBeNull()
  })
  test('Should call HashComparer with correct values', async () => {
    const { sut, hashComparerSpy, loadAccountByEmailRepositorySpy } = makeSut()
    await sut.auth(mockedAuthenticationParams)
    expect(hashComparerSpy.plaintext).toBe(mockedAuthenticationParams.password)
    expect(hashComparerSpy.digest).toBe(loadAccountByEmailRepositorySpy.result.password)
  })
  test('Should throw if HashComparer throws', async () => {
    const { sut, hashComparerSpy } = makeSut()
    hashComparerSpy.compare = throwError
    const authPromise = sut.auth(mockedAuthenticationParams)
    await expect(authPromise).rejects.toThrow()
  })

  test('Should return null if HashComparer returns false', async () => {
    const { sut, hashComparerSpy } = makeSut()
    hashComparerSpy.isValid = false
    const accessToken = await sut.auth(mockedAuthenticationParams)
    expect(accessToken).toBeNull()
  })
  test('Should calls Encrypter with correct plaintext', async () => {
    const { sut, encrypterSpy, loadAccountByEmailRepositorySpy } = makeSut()
    await sut.auth(mockedAuthenticationParams)
    expect(encrypterSpy.plaintext).toBe(loadAccountByEmailRepositorySpy.result.id)
  })
  test('Should throw if Encrypter throws', async () => {
    const { sut, encrypterSpy } = makeSut()
    encrypterSpy.encrypt = throwError
    const authPromise = sut.auth(mockedAuthenticationParams)
    await expect(authPromise).rejects.toThrow()
  })
  test('Should return a token on success', async () => {
    const { sut, encrypterSpy } = makeSut()
    const accessToken = await sut.auth(mockedAuthenticationParams)
    expect(accessToken).toBe(encrypterSpy.ciphertext)
  })
  test('Should calls UpdateAccessTokenRepository with correct values', async () => {
    const {
      sut,
      updateAccessTokenRepositorySpy,
      encrypterSpy,
      loadAccountByEmailRepositorySpy,
    } = makeSut()
    await sut.auth(mockedAuthenticationParams)
    expect(updateAccessTokenRepositorySpy.id).toBe(loadAccountByEmailRepositorySpy.result.id)
    expect(updateAccessTokenRepositorySpy.token).toBe(encrypterSpy.ciphertext)
  })
  test('Should throw if UpdateAccessTokenRepository throws', async () => {
    const { sut, updateAccessTokenRepositorySpy } = makeSut()
    updateAccessTokenRepositorySpy.updateAccessToken = throwError
    const authPromise = sut.auth(mockedAuthenticationParams)
    await expect(authPromise).rejects.toThrow()
  })
})
