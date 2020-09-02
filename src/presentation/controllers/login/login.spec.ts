import { LoginController } from './login'
import { HttpRequest } from '../../protocols'
import { badRequest } from '../../helpers/http-helper'
import { MissingParamError } from '../../errors'

const makeSut = (): LoginController => {
  return new LoginController()
}

const makeMockRequest = (): HttpRequest => ({
  body: {
    email: 'any_email@mail.com',
    password: 'any_password'
  }
})
describe('Login Controller',() => {
  test('Should return statusCode 400 and Missing Param Error if no email is provided ', async () => {
    const sut = makeSut()
    const httpRequest = makeMockRequest()
    delete httpRequest.body.email
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })
  test('Should return statusCode 400 and Missing Param Error if no password is provided ', async () => {
    const sut = makeSut()
    const httpRequest = makeMockRequest()
    delete httpRequest.body.password
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
  })
})
