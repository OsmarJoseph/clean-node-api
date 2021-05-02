import { AuthMiddleware } from '@/presentation/middlewares'
import {
  forbidenRequest,
  okRequest,
  serverErrorRequest
} from '@/presentation/helpers'
import { AccessDeniedError } from '@/presentation/errors'
import { LoadAccountIdByTokenSpy } from '@/tests/_presentation/mocks'
import { throwError } from '@/tests/_helpers'

import faker from 'faker'

const mockRequest = (): AuthMiddleware.Request => ({
  accessToken: faker.random.uuid()
})

type SutTypes = {
  sut: AuthMiddleware
  loadAccountIdByTokenSpy: LoadAccountIdByTokenSpy
}
const makeSut = (role?: string): SutTypes => {
  const loadAccountIdByTokenSpy = new LoadAccountIdByTokenSpy()
  const sut = new AuthMiddleware(loadAccountIdByTokenSpy, role)

  return {
    sut,
    loadAccountIdByTokenSpy
  }
}
describe('Auth Middleware', () => {
  test('Should return 403 if no x-access-token be found in headers', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(forbidenRequest(new AccessDeniedError()))
  })
  test('Should call LoadAccountIdByToken with correct accessToken', async () => {
    const role = faker.random.word()
    const { sut, loadAccountIdByTokenSpy } = makeSut(role)
    const mockedRequest = mockRequest()
    await sut.handle(mockedRequest)
    expect(loadAccountIdByTokenSpy.accessToken).toBe(mockedRequest.accessToken)
    expect(loadAccountIdByTokenSpy.role).toBe(role)
  })
  test('Should return 403 if LoadAccountIdByToken return null', async () => {
    const { sut, loadAccountIdByTokenSpy } = makeSut()
    loadAccountIdByTokenSpy.result = null
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(forbidenRequest(new AccessDeniedError()))
  })

  test('Should return 200 if LoadAccountIdByToken return an account', async () => {
    const { sut, loadAccountIdByTokenSpy } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(
      okRequest({ accountId: loadAccountIdByTokenSpy.result })
    )
  })
  test('Should return 500 if LoadAccountIdByToken throws', async () => {
    const { sut, loadAccountIdByTokenSpy } = makeSut()
    loadAccountIdByTokenSpy.loadAccountIdByToken = throwError
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverErrorRequest(new Error()))
  })
})
