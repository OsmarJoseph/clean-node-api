import { DbLoadAccountIdByToken } from '@/data/usecases'
import { throwError } from '@/tests/domain-tests/mocks'
import { DecrypterSpy, LoadAccountIdByTokenRepositorySpy } from '@/tests/data-tests/mocks'
import faker from 'faker'
type SutTypes = {
  sut: DbLoadAccountIdByToken
  decrypterSpy: DecrypterSpy
  loadAccountIdByTokenRepositorySpy: LoadAccountIdByTokenRepositorySpy
}

const makeSut = (): SutTypes => {
  const decrypterSpy = new DecrypterSpy()
  const loadAccountIdByTokenRepositorySpy = new LoadAccountIdByTokenRepositorySpy()
  const sut = new DbLoadAccountIdByToken(decrypterSpy,loadAccountIdByTokenRepositorySpy)
  return {
    sut,
    decrypterSpy,
    loadAccountIdByTokenRepositorySpy
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
    await sut.loadAccountIdByToken(token, role)
    expect(decrypterSpy.ciphertext).toBe(token)
  })
  test('Should return if decrypter return null', async () => {
    const { sut,decrypterSpy } = makeSut()
    decrypterSpy.plaintext = null
    const accountId = await sut.loadAccountIdByToken(token, role)
    expect(accountId).toBeNull()
  })
  test('Should call LoadAccountIdByTokenRepository with correct values', async () => {
    const { sut,loadAccountIdByTokenRepositorySpy } = makeSut()
    await sut.loadAccountIdByToken(token,role)
    expect(loadAccountIdByTokenRepositorySpy.token).toBe(token)
    expect(loadAccountIdByTokenRepositorySpy.role).toBe(role)
  })
  test('Should return null if LoadAccountIdByTokenRepository return null', async () => {
    const { sut,loadAccountIdByTokenRepositorySpy } = makeSut()
    loadAccountIdByTokenRepositorySpy.result = null
    const accountId = await sut.loadAccountIdByToken(token,role)
    expect(accountId).toBeNull()
  })
  test('Should return an account id on success', async () => {
    const { sut,loadAccountIdByTokenRepositorySpy } = makeSut()
    const accountId = await sut.loadAccountIdByToken(token,role)
    expect(accountId).toEqual(loadAccountIdByTokenRepositorySpy.result)
  })
  test('Should return null if Decrypter throws', async () => {
    const { sut,decrypterSpy } = makeSut()
    decrypterSpy.decrypt = throwError
    const accountId = await sut.loadAccountIdByToken(token,role)
    expect(accountId).toBeNull()
  })
  test('Should throw if LoadAccountIdByTokenRepository throws', async () => {
    const { sut,loadAccountIdByTokenRepositorySpy } = makeSut()
    loadAccountIdByTokenRepositorySpy.loadAccountIdByToken = throwError
    const accountIdPromise = sut.loadAccountIdByToken(token,role)
    await expect(accountIdPromise).rejects.toThrow()
  })
})
