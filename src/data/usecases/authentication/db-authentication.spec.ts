import { AccountModel } from '../../../domain/models/account'
import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'
import { DbAuthentication } from './db-authentication'
import { AuthenticationModel } from '../../../domain/usecases/authentication'
import { HashComparer } from '../../protocols/criptography/hash-comparer'
import { TokenGenerator } from '../../protocols/criptography/token-generator'

const makeMockAccount = (): AccountModel => ({
  id: 'any_id',
  email: 'any_email@mail.com',
  name: 'any_name',
  password: 'hashed_password'

})

const makeAuthenticationParams = (): AuthenticationModel => ({
  email: 'any_email@mail.com',
  password: 'any_password'
})

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async load (email: string): Promise<AccountModel> {
      return makeMockAccount()
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}

const makeHashComparer = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    async compare (value: string,hash: string): Promise<boolean> {
      return true
    }
  }
  return new HashComparerStub()
}

const makeTokenGenerator = (): TokenGenerator => {
  class TokenGeneratorStub implements TokenGenerator {
    async generate (userId: string): Promise<string> {
      return 'any_token'
    }
  }
  return new TokenGeneratorStub()
}

interface SutTypes {
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
  sut: DbAuthentication
  hashComparerStub: HashComparer
  tokenGeneratorStub: TokenGenerator
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository()
  const hashComparerStub = makeHashComparer()
  const tokenGeneratorStub = makeTokenGenerator()

  const sut = new DbAuthentication(
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    tokenGeneratorStub
  )
  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    tokenGeneratorStub
  }
}

describe('DbAuthentication UseCase',() => {
  test('Should call LoadAccountByEmailRepository with correct values',async () => {
    const { sut,loadAccountByEmailRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub,'load')
    await sut.auth(makeAuthenticationParams())
    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com')
  })
  test('Should throw if LoadAccountByEmailRepository throws',async () => {
    const { sut,loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub,'load').mockReturnValueOnce(new Promise((resolve,reject) => reject(new Error())))
    const authPromise = sut.auth(makeAuthenticationParams())
    await expect(authPromise).rejects.toThrow()
  })
  test('Should return null if LoadAccountByEmailRepository returns null',async () => {
    const { sut,loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub,'load').mockReturnValueOnce(null)
    const accessToken = await sut.auth(makeAuthenticationParams())
    expect(accessToken).toBeNull()
  })
  test('Should call HashComparer with correct password',async () => {
    const { sut,hashComparerStub } = makeSut()
    const compareSpy = jest.spyOn(hashComparerStub,'compare')
    await sut.auth(makeAuthenticationParams())
    expect(compareSpy).toHaveBeenCalledWith('any_password','hashed_password')
  })
  test('Should throw if HashComparer throws',async () => {
    const { sut,hashComparerStub } = makeSut()
    jest.spyOn(hashComparerStub,'compare').mockReturnValueOnce(new Promise((resolve,reject) => reject(new Error())))
    const authPromise = sut.auth(makeAuthenticationParams())
    await expect(authPromise).rejects.toThrow()
  })
  test('Should call HashComparer with correct password',async () => {
    const { sut,hashComparerStub } = makeSut()
    const compareSpy = jest.spyOn(hashComparerStub,'compare')
    await sut.auth(makeAuthenticationParams())
    expect(compareSpy).toHaveBeenCalledWith('any_password','hashed_password')
  })
  test('Should return null if HashComparer returns false',async () => {
    const { sut,hashComparerStub } = makeSut()
    jest.spyOn(hashComparerStub,'compare').mockReturnValueOnce(new Promise(resolve => resolve(false)))
    const accessToken = await sut.auth(makeAuthenticationParams())
    expect(accessToken).toBeNull()
  })
  test('Should calls TokenGenerator with correct id',async () => {
    const { sut,tokenGeneratorStub } = makeSut()
    const generateSpy = jest.spyOn(tokenGeneratorStub,'generate')
    await sut.auth(makeAuthenticationParams())
    expect(generateSpy).toHaveBeenCalledWith('any_id')
  })
})
