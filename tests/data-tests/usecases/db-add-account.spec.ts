import { DbAddAccount } from '@/data/usecases'
import { mockAddAccountParams, mockAccountModel, throwError } from '@/tests/domain-tests/mocks'
import { HasherSpy, AddAccountRepositorySpy, LoadAccountByEmailRepositorySpy } from '@/tests/data-tests/mocks'

type SutTypes = {
  sut: DbAddAccount
  hasherSpy: HasherSpy
  addAccountRepositorySpy: AddAccountRepositorySpy
  loadAccountByEmailRepositorySpy: LoadAccountByEmailRepositorySpy
}

const makeSut = (): SutTypes => {
  const hasherSpy = new HasherSpy()
  const addAccountRepositorySpy = new AddAccountRepositorySpy()
  const loadAccountByEmailRepositorySpy = new LoadAccountByEmailRepositorySpy()
  loadAccountByEmailRepositorySpy.result = null

  const sut = new DbAddAccount(
    hasherSpy,
    addAccountRepositorySpy,
    loadAccountByEmailRepositorySpy
  )
  return {
    sut,
    hasherSpy,
    addAccountRepositorySpy,
    loadAccountByEmailRepositorySpy
  }
}
describe('DbAddAccount Usecase', () => {
  test('Should call Hasher with correct password', async () => {
    const { sut, hasherSpy } = makeSut()
    const addAccountParams = mockAddAccountParams()
    await sut.add(addAccountParams)
    expect(hasherSpy.plaintext).toBe(addAccountParams.password)
  })

  test('Should throw if Hasher throws error', async () => {
    const { sut, hasherSpy } = makeSut()
    hasherSpy.hash = throwError
    const accountPromise = sut.add(mockAddAccountParams())
    await expect(accountPromise).rejects.toThrow()
  })

  test('Should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositorySpy,hasherSpy } = makeSut()
    const accountData = mockAddAccountParams()
    const accountDataWithHashedPassword = {
      ...accountData,
      password: hasherSpy.digest
    }
    await sut.add(accountData)
    expect(addAccountRepositorySpy.params).toEqual(accountDataWithHashedPassword)
  })

  test('Should return false if AddAccountRepository returns false', async () => {
    const { sut, addAccountRepositorySpy } = makeSut()
    addAccountRepositorySpy.result = false
    const isValid = await sut.add(mockAddAccountParams())
    expect(isValid).toBe(false)
  })

  test('Should throw if AddAccountRepository throws error', async () => {
    const { sut, addAccountRepositorySpy } = makeSut()
    addAccountRepositorySpy.add = throwError
    const isValidPromise = sut.add(mockAddAccountParams())
    await expect(isValidPromise).rejects.toThrow()
  })

  test('Should return if is valid on success', async () => {
    const { sut } = makeSut()
    const isValid = await sut.add(mockAddAccountParams())
    expect(isValid).toBe(true)
  })

  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositorySpy } = makeSut()
    const addAccountParams = mockAddAccountParams()
    await sut.add(addAccountParams)
    expect(loadAccountByEmailRepositorySpy.email).toBe(addAccountParams.email)
  })

  test('Should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositorySpy } = makeSut()
    loadAccountByEmailRepositorySpy.loadByEmail = throwError
    const authPromise = sut.add(mockAddAccountParams())
    await expect(authPromise).rejects.toThrow()
  })

  test('Should return false if LoadAccountByEmailRepository find a account', async () => {
    const { sut,loadAccountByEmailRepositorySpy } = makeSut()
    loadAccountByEmailRepositorySpy.result = mockAccountModel()
    const isValid = await sut.add(mockAddAccountParams())
    expect(isValid).toBe(false)
  })
})
