import { Controller, HttpRequest, HttpResponse,EmailValidator,Authentication } from './login-protocols'
import { badRequest, serverError, unauthorizedRequest } from '../../helpers/http-helper'
import { MissingParamError, InvalidParamError } from '../../errors'

export class LoginController implements Controller {
  constructor (
    private readonly emailValidator: EmailValidator,
    private readonly authentication: Authentication

  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['email','password']
      const { body } = httpRequest
      for (const field of requiredFields) {
        if (!body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }
      const { email,password } = body
      const isValid = this.emailValidator.isValid(email)
      if (!isValid) {
        return badRequest(new InvalidParamError('email'))
      }

      const accessToken = await this.authentication.auth(email,password)
      if (!accessToken) {
        return unauthorizedRequest()
      }
    } catch (error) {
      return serverError(error)
    }
  }
}
