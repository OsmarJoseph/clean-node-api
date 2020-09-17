import { forbidenRequest } from '../helpers/http/http-helper'
import { AccessDeniedError } from '../errors'
import { AuthMiddleware } from './auth-middleware'
import { HttpRequest } from '../protocols'
import { LoadAccountByToken } from '../../domain/usecases/load-account-by-token'
import { AccountModel } from '../../domain/models/account'
const makeHttpRequest = (): HttpRequest => ({
  headers: {
    'x-access-token': 'any_token'
  }
})
const makeLoadAccountByToken = (): LoadAccountByToken => {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    async loadByToken (accessToken: string,role?: string): Promise<AccountModel> {
      return null
    }
  }
  return new LoadAccountByTokenStub()
}
interface SutTypes{
  sut: AuthMiddleware
  loadAccountByTokenStub: LoadAccountByToken
}
const makeSut = (): SutTypes => {
  const loadAccountByTokenStub = makeLoadAccountByToken()
  const sut = new AuthMiddleware(loadAccountByTokenStub)

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
    const { sut,loadAccountByTokenStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByTokenStub, 'loadByToken')
    await sut.handle(makeHttpRequest())
    expect(loadSpy).toHaveBeenCalledWith('any_token')
  })
})
