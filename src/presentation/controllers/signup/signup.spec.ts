import { SignUpController } from './signup'
import { MissingParamError,InvalidParamError } from '../../errors'
import { EmailValidator, AddAccount, AddAccountModel, AccountModel } from './signup-protocols'
import { HttpRequest } from '../../protocols'
import { successResponse,badRequest,serverErrorResponse } from '../../helpers/http-helper'

const makeEmailValidator = (): EmailValidator => {
  class EMailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EMailValidatorStub()
}
const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (account: AddAccountModel): Promise<AccountModel> {
      return makeValidAccount()
    }
  }
  return new AddAccountStub()
}

const makeMockRequest = (): HttpRequest => ({
  body: {
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password',
    passwordConfirmation: 'any_password'
  }
})

const makeValidAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'valid_password'
})

interface SutTypes {
  sut: SignUpController
  emailValidatorStub: EmailValidator
  addAccountStub: AddAccount
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const addAccountStub = makeAddAccount()

  const sut = new SignUpController(emailValidatorStub,addAccountStub)
  return {
    sut,
    emailValidatorStub,
    addAccountStub
  }
}

describe('SignUp Controller', () => {
  test('Should return 400 if no name is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = makeMockRequest()
    delete httpRequest.body.name
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('name')))
  })

  test('Should return 400 if no email is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = makeMockRequest()
    delete httpRequest.body.email
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })

  test('Should return 400 if no password is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = makeMockRequest()
    delete httpRequest.body.password
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
  })

  test('Should return 400 if no password confirmation is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = makeMockRequest()
    delete httpRequest.body.passwordConfirmation
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('passwordConfirmation')))
  })

  test('Should return 400 if password confirmation fails', async () => {
    const { sut } = makeSut()
    const httpRequest = makeMockRequest()
    httpRequest.body.passwordConfirmation = 'invalid_password'
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('passwordConfirmation')))
  })

  test('Should return 400 if an invalid email is provided', async () => {
    const { sut,emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub,'isValid').mockReturnValueOnce(false)
    const httpResponse = await sut.handle(makeMockRequest())
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
  })

  test('Should call EmailValidator with correct email', async () => {
    const { sut,emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub,'isValid')
    await sut.handle(makeMockRequest())
    expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  test('Should return 500 if EmailValidator throws', async () => {
    const { sut,emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub,'isValid').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpResponse = await sut.handle(makeMockRequest())
    expect(httpResponse).toEqual(serverErrorResponse(new Error()))
  })

  test('Should call addAccount with correct values', async () => {
    const { sut,addAccountStub } = makeSut()
    const addSpy = jest.spyOn(addAccountStub,'add')
    await sut.handle(makeMockRequest())

    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    })
  })

  test('Should return 500 if AddAccount throws', async () => {
    const { sut,addAccountStub } = makeSut()
    jest.spyOn(addAccountStub,'add').mockImplementationOnce(async () => {
      throw new Error()
    })
    const httpResponse = await sut.handle(makeMockRequest())
    expect(httpResponse).toEqual(serverErrorResponse(new Error()))
  })

  test('Should return 200 if valid data is provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeMockRequest())
    expect(httpResponse).toEqual(successResponse(makeValidAccount()))
  })
})
