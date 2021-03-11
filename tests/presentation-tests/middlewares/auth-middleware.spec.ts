import { LoadAccountByToken } from '@/domain/usecases'
import { AuthMiddleware } from '@/presentation/middlewares'
import { forbidenRequest, okRequest, serverErrorRequest } from '@/presentation/helpers'
import { AccessDeniedError } from '@/presentation/errors'
import { HttpRequest } from '@/presentation/protocols'
import { makeMockLoadAccountByToken } from '@/tests/presentation-tests/mocks'
import { throwError } from '@/tests/domain-tests/mocks'

const makeHttpRequest = (): HttpRequest => ({
  headers: {
    'x-access-token': 'any_token'
  }
})

type SutTypes = {
  sut: AuthMiddleware
  loadAccountByTokenStub: LoadAccountByToken
}
const makeSut = (role?: string): SutTypes => {
  const loadAccountByTokenStub = makeMockLoadAccountByToken()
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
    jest.spyOn(loadAccountByTokenStub, 'loadByToken').mockReturnValueOnce(Promise.resolve(null))
    const httpResponse = await sut.handle(makeHttpRequest())
    expect(httpResponse).toEqual(forbidenRequest(new AccessDeniedError()))
  })

  test('Should return 200 if LoadAccountByToken return an account', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeHttpRequest())
    expect(httpResponse).toEqual(okRequest({ accountId: 'any_id' }))
  })
  test('Should return 500 if LoadAccountByToken throws', async () => {
    const { sut,loadAccountByTokenStub } = makeSut()
    jest.spyOn(loadAccountByTokenStub, 'loadByToken').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(makeHttpRequest())
    expect(httpResponse).toEqual(serverErrorRequest(new Error()))
  })
})
