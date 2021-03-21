import { DbLoadAccountByToken } from '@/data/usecases'
import { throwError } from '@/tests/domain-tests/mocks'
import { DecrypterSpy, LoadAccountByTokenRepositorySpy } from '@/tests/data-tests/mocks'
import faker from 'faker'
type SutTypes = {
  sut: DbLoadAccountByToken
  decrypterSpy: DecrypterSpy
  loadAccountByTokenRepositorySpy: LoadAccountByTokenRepositorySpy
}

const makeSut = (): SutTypes => {
  const decrypterSpy = new DecrypterSpy()
  const loadAccountByTokenRepositorySpy = new LoadAccountByTokenRepositorySpy()
  const sut = new DbLoadAccountByToken(decrypterSpy,loadAccountByTokenRepositorySpy)
  return {
    sut,
    decrypterSpy,
    loadAccountByTokenRepositorySpy
  }
}

let token: string
let role: string

describe('Db LoadAccount By Token Usecase', () => {
  beforeEach(() => {
    token = faker.random.uuid()
    role = faker.random.word()
  })

  test('Should call decrypter with correct ciphertext', async () => {
    const { sut,decrypterSpy } = makeSut()
    await sut.loadByToken(token, role)
    expect(decrypterSpy.ciphertext).toBe(token)
  })
  test('Should return if decrypter return null', async () => {
    const { sut,decrypterSpy } = makeSut()
    decrypterSpy.plaintext = null
    const account = await sut.loadByToken(token, role)
    expect(account).toBeNull()
  })
  test('Should call LoadAccountByTokenRepository with correct values', async () => {
    const { sut,loadAccountByTokenRepositorySpy } = makeSut()
    await sut.loadByToken(token,role)
    expect(loadAccountByTokenRepositorySpy.token).toBe(token)
    expect(loadAccountByTokenRepositorySpy.role).toBe(role)
  })
  test('Should return null if LoadAccountByTokenRepository return null', async () => {
    const { sut,loadAccountByTokenRepositorySpy } = makeSut()
    loadAccountByTokenRepositorySpy.result = null
    const account = await sut.loadByToken(token,role)
    expect(account).toBeNull()
  })
  test('Should return an account on success', async () => {
    const { sut,loadAccountByTokenRepositorySpy } = makeSut()
    const account = await sut.loadByToken(token,role)
    expect(account).toEqual(loadAccountByTokenRepositorySpy.result)
  })
  test('Should return null if Decrypter throws', async () => {
    const { sut,decrypterSpy } = makeSut()
    decrypterSpy.decrypt = throwError
    const account = await sut.loadByToken(token,role)
    expect(account).toBeNull()
  })
  test('Should throw if LoadAccountByTokenRepository throws', async () => {
    const { sut,loadAccountByTokenRepositorySpy } = makeSut()
    loadAccountByTokenRepositorySpy.loadByToken = throwError
    const accountPromise = sut.loadByToken(token,role)
    await expect(accountPromise).rejects.toThrow()
  })
})
