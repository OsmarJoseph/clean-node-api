import { forbidenRequest, okRequest, serverErrorResponse } from '../helpers/http/http-helper'
import { AccessDeniedError } from '../errors'
import { AuthMiddleware } from './auth-middleware'
import { HttpRequest, AccountModel, LoadAccountByToken } from './auth-middleware-protocols'

const makeHttpRequest = (): HttpRequest => ({
  headers: {
    'x-access-token': 'any_token'
  }
})
const makeMockValidAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'hashed_password'
})
const makeLoadAccountByToken = (): LoadAccountByToken => {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    async loadByToken (accessToken: string,role?: string): Promise<AccountModel> {
      return makeMockValidAccount()
    }
  }
  return new LoadAccountByTokenStub()
}
interface SutTypes{
  sut: AuthMiddleware
  loadAccountByTokenStub: LoadAccountByToken
}
const makeSut = (role?: string): SutTypes => {
  const loadAccountByTokenStub = makeLoadAccountByToken()
  const sut = new AuthMiddleware(loadAccountByTokenStub,role)

  return {
    sut,
    loadAccountByTokenStub
  }
}
describe('Auth Middleware', () => {
  test('Should return 403 if no x-access-token be found in headers', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(forbidenRequest(new AccessDeniedError()))
  })
  test('Should call LoadAccountByToken with correct accessToken', async () => {
    const role = 'any_role'
    const { sut,loadAccountByTokenStub } = makeSut(role)
    const loadSpy = jest.spyOn(loadAccountByTokenStub, 'loadByToken')
    await sut.handle(makeHttpRequest())
    expect(loadSpy).toHaveBeenCalledWith('any_token','any_role')
  })
  test('Should return 403 if LoadAccountByToken return null', async () => {
    const { sut,loadAccountByTokenStub } = makeSut()
    jest.spyOn(loadAccountByTokenStub, 'loadByToken').mockReturnValueOnce(new Promise(resolve => resolve(null)))
    const httpResponse = await sut.handle(makeHttpRequest())
    expect(httpResponse).toEqual(forbidenRequest(new AccessDeniedError()))
  })

  test('Should return 200 if LoadAccountByToken return an account', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeHttpRequest())
    expect(httpResponse).toEqual(okRequest({ accountId: 'valid_id' }))
  })
  test('Should return 500 if LoadAccountByToken throws', async () => {
    const { sut,loadAccountByTokenStub } = makeSut()
    jest.spyOn(loadAccountByTokenStub, 'loadByToken').mockReturnValueOnce(new Promise((resolve,reject) => reject(new Error())))
    const httpResponse = await sut.handle(makeHttpRequest())
    expect(httpResponse).toEqual(serverErrorResponse(new Error()))
  })
})
