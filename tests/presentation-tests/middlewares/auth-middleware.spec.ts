import { AuthMiddleware } from '@/presentation/middlewares'
import { forbidenRequest, okRequest, serverErrorRequest } from '@/presentation/helpers'
import { AccessDeniedError } from '@/presentation/errors'
import { HttpRequest } from '@/presentation/protocols'
import { LoadAccountByTokenSpy } from '@/tests/presentation-tests/mocks'
import { throwError } from '@/tests/domain-tests/mocks'

import faker from 'faker'

const makeHttpRequest = (): HttpRequest => ({
  headers: {
    'x-access-token': faker.random.uuid()
  }
})

type SutTypes = {
  sut: AuthMiddleware
  loadAccountByTokenSpy: LoadAccountByTokenSpy
}
const makeSut = (role?: string): SutTypes => {
  const loadAccountByTokenSpy = new LoadAccountByTokenSpy()
  const sut = new AuthMiddleware(loadAccountByTokenSpy,role)

  return {
    sut,
    loadAccountByTokenSpy
  }
}
describe('Auth Middleware', () => {
  test('Should return 403 if no x-access-token be found in headers', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(forbidenRequest(new AccessDeniedError()))
  })
  test('Should call LoadAccountByToken with correct accessToken', async () => {
    const role = faker.random.word()
    const { sut,loadAccountByTokenSpy } = makeSut(role)
    const httpRequest = makeHttpRequest()
    await sut.handle(httpRequest)
    expect(loadAccountByTokenSpy.accessToken).toBe(httpRequest.headers['x-access-token'])
    expect(loadAccountByTokenSpy.role).toBe(role)
  })
  test('Should return 403 if LoadAccountByToken return null', async () => {
    const { sut,loadAccountByTokenSpy } = makeSut()
    loadAccountByTokenSpy.result = null
    const httpResponse = await sut.handle(makeHttpRequest())
    expect(httpResponse).toEqual(forbidenRequest(new AccessDeniedError()))
  })

  test('Should return 200 if LoadAccountByToken return an account', async () => {
    const { sut,loadAccountByTokenSpy } = makeSut()
    const httpResponse = await sut.handle(makeHttpRequest())
    expect(httpResponse).toEqual(okRequest({ accountId: loadAccountByTokenSpy.result.id }))
  })
  test('Should return 500 if LoadAccountByToken throws', async () => {
    const { sut,loadAccountByTokenSpy } = makeSut()
    loadAccountByTokenSpy.loadByToken = throwError
    const httpResponse = await sut.handle(makeHttpRequest())
    expect(httpResponse).toEqual(serverErrorRequest(new Error()))
  })
})
