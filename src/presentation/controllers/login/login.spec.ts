import { LoginController } from './login'
import { HttpRequest,EmailValidator ,Authentication } from './login-protocols'
import { badRequest, serverErrorResponse, unauthorizedRequest, successResponse } from '../../helpers/http-helper'
import { MissingParamError, InvalidParamError } from '../../errors'

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

const makeAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (email: string,password: string): Promise<string> {
      return 'any_token'
    }
  }
  return new AuthenticationStub()
}
interface SutTypes {
  sut: LoginController
  emailValidatorStub: EmailValidator
  authenticationStub: Authentication
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const authenticationStub = makeAuthentication()
  const sut = new LoginController(emailValidatorStub,authenticationStub)
  return {
    sut,
    emailValidatorStub,
    authenticationStub
  }
}

const makeMockRequest = (): HttpRequest => ({
  body: {
    email: 'any_mail@mail.com',
    password: 'any_password'
  }
})
describe('Login Controller',() => {
  test('Should return statusCode 400 and Missing Param Error if no email is provided ', async () => {
    const { sut } = makeSut()
    const httpRequest = makeMockRequest()
    delete httpRequest.body.email
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })
  test('Should return statusCode 400 and Missing Param Error if no password is provided ', async () => {
    const { sut } = makeSut()
    const httpRequest = makeMockRequest()
    delete httpRequest.body.password
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
  })

  test('Should call emailValidator with correct email',async () => {
    const { sut,emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub,'isValid')
    await sut.handle(makeMockRequest())
    expect(isValidSpy).toHaveBeenCalledWith('any_mail@mail.com')
  })

  test('Should return 400 if an invalid email is provided',async () => {
    const { sut,emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub,'isValid').mockReturnValueOnce(false)
    const httpResponse = await sut.handle(makeMockRequest())
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
  })
  test('Should return 500 if email validator throws',async () => {
    const { sut,emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub,'isValid').mockImplementationOnce(() => { throw new Error() })
    const httpResponse = await sut.handle(makeMockRequest())
    expect(httpResponse).toEqual(serverErrorResponse(new Error()))
  })
  test('Should call Authentication with correct values',async () => {
    const { sut,authenticationStub } = makeSut()
    const authSpy = jest.spyOn(authenticationStub,'auth')
    const httpRequest = makeMockRequest()
    await sut.handle(httpRequest)
    expect(authSpy).toHaveBeenCalledWith('any_mail@mail.com','any_password')
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
    expect(httpResponse).toEqual(serverErrorResponse(new Error()))
  })
  test('Should return 200 if valid credentials are provided',async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeMockRequest())
    expect(httpResponse).toEqual(successResponse({ accessToken: 'any_token' }))
  })
})
