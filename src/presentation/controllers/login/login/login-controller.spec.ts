import { LoginController } from './login-controller'
import { HttpRequest, Authentication, Validation } from './login-controller-protocols'
import { badRequest, serverErrorRequest, unauthorizedRequest, okRequest } from '@/presentation/helpers/http/http-helper'
import { makeMockAuthenticationParams } from '@/domain/test'
import { makeMockAuthentication, makeMockValidation } from '@/presentation/test'

type SutTypes = {
  sut: LoginController
  authenticationStub: Authentication
  validationStub: Validation
}

const makeSut = (): SutTypes => {
  const authenticationStub = makeMockAuthentication()
  const validationStub = makeMockValidation()

  const sut = new LoginController(authenticationStub,validationStub)
  return {
    sut,
    authenticationStub,
    validationStub
  }
}

const makeMockRequest = (): HttpRequest => ({
  body: {
    ...makeMockAuthenticationParams()
  }
})
describe('Login Controller',() => {
  test('Should call Authentication with correct values',async () => {
    const { sut,authenticationStub } = makeSut()
    const authSpy = jest.spyOn(authenticationStub,'auth')
    const httpRequest = makeMockRequest()
    await sut.handle(httpRequest)
    expect(authSpy).toHaveBeenCalledWith(
      {
        email: 'any_email@mail.com',
        password: 'any_password'
      })
  })
  test('Should return 401 if invalid credentials are provided',async () => {
    const { sut,authenticationStub } = makeSut()
    jest.spyOn(authenticationStub,'auth').mockReturnValueOnce(new Promise((resolve) => resolve(null)))
    const httpResponse = await sut.handle(makeMockRequest())
    expect(httpResponse).toEqual(unauthorizedRequest())
  })
  test('Should return 500 if authentication throws',async () => {
    const { sut,authenticationStub } = makeSut()
    jest.spyOn(authenticationStub,'auth').mockImplementationOnce(async () => { throw new Error() })
    const httpResponse = await sut.handle(makeMockRequest())
    expect(httpResponse).toEqual(serverErrorRequest(new Error()))
  })
  test('Should return 200 if valid credentials are provided',async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeMockRequest())
    expect(httpResponse).toEqual(okRequest({ accessToken: 'any_token' }))
  })
  test('Should call validation with correct value', async () => {
    const { sut,validationStub } = makeSut()
    const validationSpy = jest.spyOn(validationStub,'validate')
    const httpRequest = makeMockRequest()
    await sut.handle(httpRequest)

    expect(validationSpy).toHaveBeenCalledWith(httpRequest.body)
  })
  test('Should return 400 if validation returns an error', async () => {
    const { sut,validationStub } = makeSut()
    jest.spyOn(validationStub,'validate').mockReturnValueOnce(new Error())
    const httpResponse = await sut.handle(makeMockRequest())
    expect(httpResponse).toEqual(badRequest(new Error()))
  })
})
