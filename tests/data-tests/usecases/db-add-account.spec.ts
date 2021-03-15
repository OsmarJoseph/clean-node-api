import { DbAddAccount } from '@/data/usecases'
import { makeMockAddAccountParams, makeMockAccountModel, throwError } from '@/tests/domain-tests/mocks'
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
    await sut.add(makeMockAddAccountParams())
    expect(hasherSpy.plaintext).toBe('any_password')
  })

  test('Should throw if Hasher throws error', async () => {
    const { sut, hasherSpy } = makeSut()
    hasherSpy.hash = throwError
    const accountPromise = sut.add(makeMockAddAccountParams())
    await expect(accountPromise).rejects.toThrow()
  })

  test('Should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositorySpy,hasherSpy } = makeSut()
    const accountData = makeMockAddAccountParams()
    const accountDataWithHashedPassword = {
      ...accountData,
      password: hasherSpy.digest
    }
    await sut.add(accountData)
    expect(addAccountRepositorySpy.params).toEqual(accountDataWithHashedPassword)
  })

  test('Should throw if AddAccountRepository throws error', async () => {
    const { sut, addAccountRepositorySpy } = makeSut()
    addAccountRepositorySpy.add = throwError
    const accountPromise = sut.add(makeMockAddAccountParams())
    await expect(accountPromise).rejects.toThrow()
  })

  test('Should return an account on success', async () => {
    const { sut } = makeSut()
    const account = await sut.add(makeMockAddAccountParams())
    expect(account).toEqual(makeMockAccountModel())
  })

  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositorySpy } = makeSut()

    await sut.add(makeMockAddAccountParams())
    expect(loadAccountByEmailRepositorySpy.email).toBe('any_email@mail.com')
  })

  test('Should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositorySpy } = makeSut()
    loadAccountByEmailRepositorySpy.loadByEmail = throwError
    const authPromise = sut.add(makeMockAddAccountParams())
    await expect(authPromise).rejects.toThrow()
  })

  test('Should return null if LoadAccountByEmailRepository find a account', async () => {
    const { sut,loadAccountByEmailRepositorySpy } = makeSut()
    loadAccountByEmailRepositorySpy.result = makeMockAccountModel()
    const account = await sut.add(makeMockAddAccountParams())
    expect(account).toBeNull()
  })
})
