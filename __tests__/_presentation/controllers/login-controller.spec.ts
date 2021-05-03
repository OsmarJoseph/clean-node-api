import {
  badRequest,
  serverErrorRequest,
  unauthorizedRequest,
  okRequest,
} from '@/presentation/helpers'
import { LoginController } from '@/presentation/controllers'
import { throwError } from '@/tests/_helpers'
import { AuthenticationSpy } from '@/tests/_presentation/mocks'
import { ValidationSpy } from '@/tests/_validation/mocks'

import faker from 'faker'

type SutTypes = {
  sut: LoginController
  authenticationSpy: AuthenticationSpy
  validationSpy: ValidationSpy
}

const makeSut = (): SutTypes => {
  const authenticationSpy = new AuthenticationSpy()
  const validationSpy = new ValidationSpy()

  const sut = new LoginController(authenticationSpy, validationSpy)
  return {
    sut,
    authenticationSpy,
    validationSpy,
  }
}

const mockRequest = (): LoginController.Request => ({
  email: faker.internet.email(),
  password: faker.internet.password(),
})

describe('Login Controller', () => {
  test('Should call Authentication with correct values', async () => {
    const { sut, authenticationSpy } = makeSut()

    const mockedRequest = mockRequest()
    const { email, password } = mockedRequest
    await sut.handle(mockedRequest)
    expect(authenticationSpy.authenticationParams).toEqual({ email, password })
  })

  test('Should return 401 if invalid credentials are provided', async () => {
    const { sut, authenticationSpy } = makeSut()
    authenticationSpy.accessToken = null
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(unauthorizedRequest())
  })
  test('Should return 500 if authentication throws', async () => {
    const { sut, authenticationSpy } = makeSut()
    authenticationSpy.auth = throwError
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverErrorRequest(new Error()))
  })
  test('Should return 200 if valid credentials are provided', async () => {
    const { sut, authenticationSpy } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(okRequest({ accessToken: authenticationSpy.accessToken }))
  })
  test('Should call validation with correct value', async () => {
    const { sut, validationSpy } = makeSut()
    const mockedRequest = mockRequest()
    await sut.handle(mockedRequest)

    expect(validationSpy.input).toEqual(mockedRequest)
  })
  test('Should return 400 if validation returns an error', async () => {
    const { sut, validationSpy } = makeSut()
    validationSpy.result = new Error()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(badRequest(new Error()))
  })
})
