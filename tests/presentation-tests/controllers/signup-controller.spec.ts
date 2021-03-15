import { HttpRequest } from '@/presentation/protocols'
import { okRequest,badRequest,serverErrorRequest, forbidenRequest } from '@/presentation/helpers'
import { makeMockAddAccountParams, throwError } from '@/tests/domain-tests/mocks'
import { ParamInUseError } from '@/presentation/errors/'
import { SignUpController } from '@/presentation/controllers'
import { AddAccountSpy, AuthenticationSpy } from '@/tests/presentation-tests/mocks'
import { ValidationSpy } from '@/tests/validation-tests/mocks'

const makeMockRequest = (): HttpRequest => ({
  body: {
    ...makeMockAddAccountParams(),
    passwordConfirmation: 'any_password'
  }
})

type SutTypes = {
  sut: SignUpController
  addAccountSpy: AddAccountSpy
  validationSpy: ValidationSpy
  authenticationSpy: AuthenticationSpy
}

const makeSut = (): SutTypes => {
  const addAccountSpy = new AddAccountSpy()
  const validationSpy = new ValidationSpy()
  const authenticationSpy = new AuthenticationSpy()

  const sut = new SignUpController(addAccountSpy,validationSpy,authenticationSpy)
  return {
    sut,
    addAccountSpy,
    validationSpy,
    authenticationSpy
  }
}

describe('SignUp Controller', () => {
  test('Should call addAccount with correct values', async () => {
    const { sut,addAccountSpy } = makeSut()
    await sut.handle(makeMockRequest())

    expect(addAccountSpy.addAccountParams).toEqual({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    })
  })

  test('Should return 500 if AddAccount throws', async () => {
    const { sut,addAccountSpy } = makeSut()
    addAccountSpy.add = throwError
    const httpResponse = await sut.handle(makeMockRequest())
    expect(httpResponse).toEqual(serverErrorRequest(new Error()))
  })

  test('Should return an accessToken on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeMockRequest())
    expect(httpResponse).toEqual(okRequest({ accessToken: 'any_token' }))
  })
  test('Should return 403 if AddAccount return null', async () => {
    const { sut,addAccountSpy } = makeSut()
    addAccountSpy.result = null
    const httpResponse = await sut.handle(makeMockRequest())
    expect(httpResponse).toEqual(forbidenRequest(new ParamInUseError('email')))
  })

  test('Should call validation with correct value', async () => {
    const { sut,validationSpy } = makeSut()
    const httpRequest = makeMockRequest()
    await sut.handle(httpRequest)

    expect(validationSpy.input).toEqual(httpRequest.body)
  })
  test('Should return 400 if validation returns an error', async () => {
    const { sut,validationSpy } = makeSut()
    validationSpy.result = new Error()
    const httpResponse = await sut.handle(makeMockRequest())
    expect(httpResponse).toEqual(badRequest(new Error()))
  })

  test('Should call Authentication with correct values',async () => {
    const { sut,authenticationSpy } = makeSut()
    const httpRequest = makeMockRequest()
    await sut.handle(httpRequest)
    expect(authenticationSpy.authenticationParams).toEqual(
      {
        email: 'any_email@mail.com',
        password: 'any_password'
      })
  })
  test('Should return 500 if authentication throws',async () => {
    const { sut,authenticationSpy } = makeSut()
    authenticationSpy.auth = throwError
    const httpResponse = await sut.handle(makeMockRequest())
    expect(httpResponse).toEqual(serverErrorRequest(new Error()))
  })
})
