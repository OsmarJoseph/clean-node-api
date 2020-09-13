import { badRequest,serverErrorResponse, successResponse } from '../../helpers/http/http-helper'
import { HttpResponse, HttpRequest,Controller, AddAccount, Validation } from './signup-controller-protocols'

export class SignUpController implements Controller {
  constructor (
    private readonly addAccount: AddAccount,
    private readonly validation: Validation
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { body } = httpRequest
      const error = this.validation.validate(body)
      if (error) {
        return badRequest(error)
      }

      const { email,password,name } = body

      const account = await this.addAccount.add({
        name,email,password
      })

      return successResponse(account)
    } catch (error) {
      console.error(error)
      return serverErrorResponse(error)
    }
  }
}
