import { Controller, HttpRequest, HttpResponse,Authentication } from './login-controller-protocols'
import { badRequest, serverErrorResponse, unauthorizedRequest, successResponse } from '../../helpers/http/http-helper'
import { Validation } from '../signup/signup-controller-protocols'

export class LoginController implements Controller {
  constructor (
    private readonly authentication: Authentication,
    private readonly validation: Validation

  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { body } = httpRequest
      const error = this.validation.validate(body)
      if (error) {
        return badRequest(error)
      }
      const { email,password } = body
      const accessToken = await this.authentication.auth({ email,password })
      if (!accessToken) {
        return unauthorizedRequest()
      }
      return successResponse({ accessToken })
    } catch (error) {
      return serverErrorResponse(error)
    }
  }
}
