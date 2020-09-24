import { SignUpController } from './signup-controller'
import { AddAccount, Validation, Authentication } from './signup-controller-protocols'
import { HttpRequest } from '@/presentation/protocols'
import { okRequest,badRequest,serverErrorRequest, forbidenRequest } from '@/presentation/helpers/http/http-helper'
import { ParamInUseError } from '@/presentation/errors/'
import { makeMockAddAccountParams, throwError } from '@/domain/test'
import { makeMockValidation, makeMockAuthentication , makeMockAddAccount } from '@/presentation/test'

const makeMockRequest = (): HttpRequest => ({
  body: {
    ...makeMockAddAccountParams(),
    passwordConfirmation: 'any_password'
  }
})

type SutTypes = {
  sut: SignUpController
  addAccountStub: AddAccount
  validationStub: Validation
  authenticationStub: Authentication
}

const makeSut = (): SutTypes => {
  const addAccountStub = makeMockAddAccount()
  const validationStub = makeMockValidation()
  const authenticationStub = makeMockAuthentication()

  const sut = new SignUpController(addAccountStub,validationStub,authenticationStub)
  return {
    sut,
    addAccountStub,
    validationStub,
    authenticationStub
  }
}

describe('SignUp Controller', () => {
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
    jest.spyOn(addAccountStub,'add').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(makeMockRequest())
    expect(httpResponse).toEqual(serverErrorRequest(new Error()))
  })

  test('Should return an accessToken on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeMockRequest())
    expect(httpResponse).toEqual(okRequest({ accessToken: 'any_token' }))
  })
  test('Should return 403 if AddAccount return null', async () => {
    const { sut,addAccountStub } = makeSut()
    jest.spyOn(addAccountStub,'add').mockReturnValueOnce(Promise.resolve(null))
    const httpResponse = await sut.handle(makeMockRequest())
    expect(httpResponse).toEqual(forbidenRequest(new ParamInUseError('email')))
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
  test('Should return 500 if authentication throws',async () => {
    const { sut,authenticationStub } = makeSut()
    jest.spyOn(authenticationStub,'auth').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(makeMockRequest())
    expect(httpResponse).toEqual(serverErrorRequest(new Error()))
  })
})
