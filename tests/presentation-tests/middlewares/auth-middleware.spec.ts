import { AuthMiddleware } from '@/presentation/middlewares'
import { forbidenRequest, okRequest, serverErrorRequest } from '@/presentation/helpers'
import { AccessDeniedError } from '@/presentation/errors'
import { HttpRequest } from '@/presentation/protocols'
import { LoadAccountByTokenSpy } from '@/tests/presentation-tests/mocks'
import { throwError } from '@/tests/domain-tests/mocks'

const makeHttpRequest = (): HttpRequest => ({
  headers: {
    'x-access-token': 'any_token'
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
    const role = 'any_role'
    const { sut,loadAccountByTokenSpy } = makeSut(role)
    await sut.handle(makeHttpRequest())
    expect(loadAccountByTokenSpy.accessToken).toBe('any_token')
    expect(loadAccountByTokenSpy.role).toBe('any_role')
  })
  test('Should return 403 if LoadAccountByToken return null', async () => {
    const { sut,loadAccountByTokenSpy } = makeSut()
    loadAccountByTokenSpy.result = null
    const httpResponse = await sut.handle(makeHttpRequest())
    expect(httpResponse).toEqual(forbidenRequest(new AccessDeniedError()))
  })

  test('Should return 200 if LoadAccountByToken return an account', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeHttpRequest())
    expect(httpResponse).toEqual(okRequest({ accountId: 'any_id' }))
  })
  test('Should return 500 if LoadAccountByToken throws', async () => {
    const { sut,loadAccountByTokenSpy } = makeSut()
    loadAccountByTokenSpy.loadByToken = throwError
    const httpResponse = await sut.handle(makeHttpRequest())
    expect(httpResponse).toEqual(serverErrorRequest(new Error()))
  })
})
