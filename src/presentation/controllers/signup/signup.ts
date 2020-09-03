import { InvalidParamError } from '../../errors'
import { badRequest,serverErrorResponse, successResponse } from '../../helpers/http-helper'
import { HttpResponse, HttpRequest,Controller, EmailValidator, AddAccount, Validation } from './signup-protocols'

export class SignUpController implements Controller {
  constructor (
    private readonly emailValidator: EmailValidator,
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

      const { email,password,passwordConfirmation,name } = body
      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'))
      }

      const isValidEmail = this.emailValidator.isValid(email)
      if (!isValidEmail) {
        return badRequest(new InvalidParamError('email'))
      }
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
