import {
  okRequest,
  badRequest,
  serverErrorRequest,
  forbidenRequest
} from '@/presentation/helpers'
import { throwError } from '@/tests/helpers'
import { ParamInUseError } from '@/presentation/errors/'
import { SignUpController } from '@/presentation/controllers'
import {
  AddAccountSpy,
  AuthenticationSpy
} from '@/tests/presentation-tests/mocks'
import { ValidationSpy } from '@/tests/validation-tests/mocks'

import faker from 'faker'

const mockRequest = (): SignUpController.Request => {
  const mockedPassword = faker.internet.password()
  return {
    email: faker.internet.email(),
    name: faker.name.findName(),
    password: mockedPassword,
    passwordConfirmation: mockedPassword
  }
}

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

  const sut = new SignUpController(
    addAccountSpy,
    validationSpy,
    authenticationSpy
  )
  return {
    sut,
    addAccountSpy,
    validationSpy,
    authenticationSpy
  }
}

describe('SignUp Controller', () => {
  let mockedRequest = mockRequest()
  beforeEach(() => {
    mockedRequest = mockRequest()
  })
  test('Should call addAccount with correct values', async () => {
    const { sut, addAccountSpy } = makeSut()

    await sut.handle(mockedRequest)
    Reflect.deleteProperty(mockedRequest, 'passwordConfirmation')
    expect(addAccountSpy.addAccountParams).toEqual(mockedRequest)
  })

  test('Should return 500 if AddAccount throws', async () => {
    const { sut, addAccountSpy } = makeSut()
    addAccountSpy.add = throwError
    const httpResponse = await sut.handle(mockedRequest)
    expect(httpResponse).toEqual(serverErrorRequest(new Error()))
  })

  test('Should return an accessToken on success', async () => {
    const { sut, authenticationSpy } = makeSut()
    const httpResponse = await sut.handle(mockedRequest)
    expect(httpResponse).toEqual(
      okRequest({ accessToken: authenticationSpy.accessToken })
    )
  })
  test('Should return 403 if AddAccount return false', async () => {
    const { sut, addAccountSpy } = makeSut()
    addAccountSpy.isValid = false
    const httpResponse = await sut.handle(mockedRequest)
    expect(httpResponse).toEqual(forbidenRequest(new ParamInUseError('email')))
  })

  test('Should call validation with correct value', async () => {
    const { sut, validationSpy } = makeSut()

    await sut.handle(mockedRequest)

    expect(validationSpy.input).toEqual(mockedRequest)
  })
  test('Should return 400 if validation returns an error', async () => {
    const { sut, validationSpy } = makeSut()
    validationSpy.result = new Error()
    const httpResponse = await sut.handle(mockedRequest)
    expect(httpResponse).toEqual(badRequest(new Error()))
  })

  test('Should call Authentication with correct values', async () => {
    const { sut, authenticationSpy } = makeSut()
    await sut.handle(mockedRequest)
    const { email, password } = mockedRequest
    expect(authenticationSpy.authenticationParams).toEqual({ email, password })
  })
  test('Should return 500 if authentication throws', async () => {
    const { sut, authenticationSpy } = makeSut()
    authenticationSpy.auth = throwError
    const httpResponse = await sut.handle(mockedRequest)
    expect(httpResponse).toEqual(serverErrorRequest(new Error()))
  })
})
