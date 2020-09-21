import { Hasher,AccountModel,AddAccountModel, AddAccountRepository,LoadAccountByEmailRepository } from './db-add-account-protocols'
import { DbAddAccount } from './db-add-account'

const makeHasherStub = (): Hasher => {
  class HasherStub implements Hasher {
    async hash (value: string): Promise<string> {
      return 'hashed_password'
    }
  }
  return new HasherStub()
}

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add (account: AddAccountModel): Promise<AccountModel> {
      return makeMockValidAccount()
    }
  }
  return new AddAccountRepositoryStub()
}

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async loadByEmail (email: string): Promise<AccountModel> {
      return null
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}

const makeMockValidAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'hashed_password'
})

const makeAccountData = (): AddAccountModel => ({
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'valid_password'
})

type SutTypes = {
  sut: DbAddAccount
  hasherStub: Hasher
  addAccountRepositoryStub: AddAccountRepository
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
}

const makeSut = (): SutTypes => {
  const hasherStub = makeHasherStub()
  const addAccountRepositoryStub = makeAddAccountRepository()
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository()
  const sut = new DbAddAccount(hasherStub,addAccountRepositoryStub,loadAccountByEmailRepositoryStub)
  return { sut,hasherStub,addAccountRepositoryStub,loadAccountByEmailRepositoryStub }
}
describe('DbAddAccount Usecase',() => {
  test('Should call Hasher with correct password',async () => {
    const { sut,hasherStub } = makeSut()
    const hashSpy = jest.spyOn(hasherStub, 'hash')
    await sut.add(makeAccountData())
    expect(hashSpy).toHaveBeenCalledWith('valid_password')
  })

  test('Should throw if Hasher throws error', async () => {
    const { sut,hasherStub } = makeSut()
    jest.spyOn(hasherStub, 'hash').mockReturnValueOnce(new Promise((resolve,reject) => reject(new Error())))
    const accountPromise = sut.add(makeAccountData())
    await expect(accountPromise).rejects.toThrow()
  })

  test('Should call AddAccountRepository with correct values',async () => {
    const { sut,addAccountRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')
    const accountData = makeAccountData()
    const accountDataWithHashedPassword = { ...accountData, password: 'hashed_password' }
    await sut.add(accountData)
    expect(addSpy).toHaveBeenCalledWith(accountDataWithHashedPassword)
  })

  test('Should throw if AddAccountRepository throws error', async () => {
    const { sut,addAccountRepositoryStub } = makeSut()
    jest.spyOn(addAccountRepositoryStub, 'add').mockReturnValueOnce(new Promise((resolve,reject) => reject(new Error())))
    const accountPromise = sut.add(makeAccountData())
    await expect(accountPromise).rejects.toThrow()
  })

  test('Should return an account on success', async () => {
    const { sut } = makeSut()
    const account = await sut.add(makeAccountData())
    expect(account).toEqual(makeMockValidAccount())
  })

  test('Should return null if LoadAccountByEmailRepository find a account', async () => {
    const { sut,loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub,'loadByEmail').mockReturnValueOnce(new Promise(resolve => resolve(makeMockValidAccount())))
    const account = await sut.add(makeAccountData())
    expect(account).toBeNull()
  })

  test('Should call LoadAccountByEmailRepository with correct email',async () => {
    const { sut,loadAccountByEmailRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub,'loadByEmail')
    await sut.add(makeAccountData())
    expect(loadSpy).toHaveBeenCalledWith('valid_email@mail.com')
  })
  test('Should throw if LoadAccountByEmailRepository throws',async () => {
    const { sut,loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub,'loadByEmail').mockReturnValueOnce(new Promise((resolve,reject) => reject(new Error())))
    const authPromise = sut.add(makeAccountData())
    await expect(authPromise).rejects.toThrow()
  })
})
