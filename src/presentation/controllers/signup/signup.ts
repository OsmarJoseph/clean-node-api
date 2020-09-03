import { MissingParamError,InvalidParamError } from '../../errors'
import { badRequest,serverError, successResponse } from '../../helpers/http-helper'
import { HttpResponse, HttpRequest,Controller, EmailValidator, AddAccount } from './signup-protocols'

export class SignUpController implements Controller {
  constructor (private readonly emailValidator: EmailValidator, private readonly addAccount: AddAccount) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['name','email','password','passwordConfirmation']
      const { body } = httpRequest
      for (const field of requiredFields) {
        if (!body[field]) {
          return badRequest(new MissingParamError(field))
        }
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
      return serverError(error)
    }
  }
}
