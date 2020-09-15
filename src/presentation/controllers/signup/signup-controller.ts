import { badRequest,serverErrorResponse, successResponse } from '../../helpers/http/http-helper'
import { HttpResponse, HttpRequest,Controller, AddAccount, Validation, Authentication } from './signup-controller-protocols'

export class SignUpController implements Controller {
  constructor (
    private readonly addAccount: AddAccount,
    private readonly validation: Validation,
    private readonly authentication: Authentication

  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { body } = httpRequest
      const error = this.validation.validate(body)
      if (error) {
        return badRequest(error)
      }

      const { email,password,name } = body

      await this.addAccount.add({
        name,email,password
      })

      const accessToken = await this.authentication.auth({
        email,
        password
      })

      return successResponse({ accessToken })
    } catch (error) {
      console.error(error)
      return serverErrorResponse(error)
    }
  }
}
