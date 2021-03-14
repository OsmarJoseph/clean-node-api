import { throwError, makeMockAuthenticationParams } from '@/tests/domain-tests/mocks'
import { DbAuthentication } from '@/data/usecases'
import { HashComparerSpy, EncrypterSpy, UpdateAccessTokenRepositorySpy, LoadAccountByEmailRepositorySpy } from '@/tests/data-tests/mocks'

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
    updateAccessTokenRepositorySpy
  )
  return {
    sut,
    loadAccountByEmailRepositorySpy,
    hashComparerSpy,
    encrypterSpy,
    updateAccessTokenRepositorySpy
  }
}

describe('DbAuthentication UseCase',() => {
  test('Should call LoadAccountByEmailRepository with correct values',async () => {
    const { sut,loadAccountByEmailRepositorySpy } = makeSut()
    await sut.auth(makeMockAuthenticationParams())
    expect(loadAccountByEmailRepositorySpy.email).toBe('any_email@mail.com')
  })
  test('Should throw if LoadAccountByEmailRepository throws',async () => {
    const { sut,loadAccountByEmailRepositorySpy } = makeSut()
    jest.spyOn(loadAccountByEmailRepositorySpy,'loadByEmail').mockImplementationOnce(throwError)
    const authPromise = sut.auth(makeMockAuthenticationParams())
    await expect(authPromise).rejects.toThrow()
  })
  test('Should return null if LoadAccountByEmailRepository returns null',async () => {
    const { sut,loadAccountByEmailRepositorySpy } = makeSut()
    jest.spyOn(loadAccountByEmailRepositorySpy,'loadByEmail').mockReturnValueOnce(null)
    const accessToken = await sut.auth(makeMockAuthenticationParams())
    expect(accessToken).toBeNull()
  })
  test('Should call HashComparer with correct values',async () => {
    const { sut,hashComparerSpy } = makeSut()
    await sut.auth(makeMockAuthenticationParams())
    expect(hashComparerSpy.plaintext).toBe('any_password')
    expect(hashComparerSpy.digest).toBe('any_password')
  })
  test('Should throw if HashComparer throws',async () => {
    const { sut,hashComparerSpy } = makeSut()
    jest.spyOn(hashComparerSpy,'compare').mockImplementationOnce(throwError)
    const authPromise = sut.auth(makeMockAuthenticationParams())
    await expect(authPromise).rejects.toThrow()
  })

  test('Should return null if HashComparer returns false',async () => {
    const { sut,hashComparerSpy } = makeSut()
    hashComparerSpy.isValid = false
    const accessToken = await sut.auth(makeMockAuthenticationParams())
    expect(accessToken).toBeNull()
  })
  test('Should calls Encrypter with correct plaintext',async () => {
    const { sut,encrypterSpy } = makeSut()
    await sut.auth(makeMockAuthenticationParams())
    expect(encrypterSpy.plaintext).toBe('any_id')
  })
  test('Should throw if Encrypter throws',async () => {
    const { sut,encrypterSpy } = makeSut()
    jest.spyOn(encrypterSpy,'encrypt').mockImplementationOnce(throwError)
    const authPromise = sut.auth(makeMockAuthenticationParams())
    await expect(authPromise).rejects.toThrow()
  })
  test('Should return a token on success',async () => {
    const { sut,encrypterSpy } = makeSut()
    const accessToken = await sut.auth(makeMockAuthenticationParams())
    expect(accessToken).toBe(encrypterSpy.ciphertext)
  })
  test('Should calls UpdateAccessTokenRepository with correct values',async () => {
    const { sut,updateAccessTokenRepositorySpy,encrypterSpy } = makeSut()
    await sut.auth(makeMockAuthenticationParams())
    expect(updateAccessTokenRepositorySpy.id).toBe('any_id')
    expect(updateAccessTokenRepositorySpy.token).toBe(encrypterSpy.ciphertext)
  })
  test('Should throw if UpdateAccessTokenRepository throws',async () => {
    const { sut,updateAccessTokenRepositorySpy } = makeSut()
    updateAccessTokenRepositorySpy.updateAccessToken = throwError
    const authPromise = sut.auth(makeMockAuthenticationParams())
    await expect(authPromise).rejects.toThrow()
  })
})
