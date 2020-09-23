import { Hasher, AddAccountRepository,LoadAccountByEmailRepository, AccountModel } from './db-add-account-protocols'
import { DbAddAccount } from './db-add-account'
import { makeMockAddAccountParams,makeMockAccountModel,throwError } from '@/domain/test'
import { makeMockHasher, makeMockAddAccountRepository } from '@/data/test'

const makeMockLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async loadByEmail (email: string): Promise<AccountModel> {
      return null
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}

type SutTypes = {
  sut: DbAddAccount
  hasherStub: Hasher
  addAccountRepositoryStub: AddAccountRepository
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
}

const makeSut = (): SutTypes => {
  const hasherStub = makeMockHasher()
  const addAccountRepositoryStub = makeMockAddAccountRepository()
  const loadAccountByEmailRepositoryStub = makeMockLoadAccountByEmailRepository()
  const sut = new DbAddAccount(hasherStub,addAccountRepositoryStub,loadAccountByEmailRepositoryStub)
  return { sut,hasherStub,addAccountRepositoryStub,loadAccountByEmailRepositoryStub }
}
describe('DbAddAccount Usecase',() => {
  test('Should call Hasher with correct password',async () => {
    const { sut,hasherStub } = makeSut()
    const hashSpy = jest.spyOn(hasherStub, 'hash')
    await sut.add(makeMockAddAccountParams())
    expect(hashSpy).toHaveBeenCalledWith('any_password')
  })

  test('Should throw if Hasher throws error', async () => {
    const { sut,hasherStub } = makeSut()
    jest.spyOn(hasherStub, 'hash').mockImplementationOnce(throwError)
    const accountPromise = sut.add(makeMockAddAccountParams())
    await expect(accountPromise).rejects.toThrow()
  })

  test('Should call AddAccountRepository with correct values',async () => {
    const { sut,addAccountRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')
    const accountData = makeMockAddAccountParams()
    const accountDataWithHashedPassword = { ...accountData, password: 'hashed_password' }
    await sut.add(accountData)
    expect(addSpy).toHaveBeenCalledWith(accountDataWithHashedPassword)
  })

  test('Should throw if AddAccountRepository throws error', async () => {
    const { sut,addAccountRepositoryStub } = makeSut()
    jest.spyOn(addAccountRepositoryStub, 'add').mockImplementationOnce(throwError)
    const accountPromise = sut.add(makeMockAddAccountParams())
    await expect(accountPromise).rejects.toThrow()
  })

  test('Should return an account on success', async () => {
    const { sut } = makeSut()
    const account = await sut.add(makeMockAddAccountParams())
    expect(account).toEqual(makeMockAccountModel())
  })

  test('Should return null if LoadAccountByEmailRepository find a account', async () => {
    const { sut,loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub,'loadByEmail').mockReturnValueOnce(new Promise(resolve => resolve(makeMockAccountModel())))
    const account = await sut.add(makeMockAddAccountParams())
    expect(account).toBeNull()
  })

  test('Should call LoadAccountByEmailRepository with correct email',async () => {
    const { sut,loadAccountByEmailRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub,'loadByEmail')
    await sut.add(makeMockAddAccountParams())
    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com')
  })
  test('Should throw if LoadAccountByEmailRepository throws',async () => {
    const { sut,loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub,'loadByEmail').mockImplementationOnce(throwError)
    const authPromise = sut.add(makeMockAddAccountParams())
    await expect(authPromise).rejects.toThrow()
  })
})
