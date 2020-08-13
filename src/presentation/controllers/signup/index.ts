import { MissingParamError,InvalidParamError } from '../../errors'
import { badRquest,serverError, success } from '../../helpers/http-helper'
import { HttpResponse, HttpRequest,Controller, EmailValidator, AddAccount } from './signup-protocols'

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly addAccount: AddAccount

  constructor (emailValidator: EmailValidator,addAccount: AddAccount) {
    this.emailValidator = emailValidator
    this.addAccount = addAccount
  }

  handle (httpRequest: HttpRequest): HttpResponse {
    try {
      const requiredFields = ['name','email','password','passwordConfirmation']
      const { body } = httpRequest
      for (const field of requiredFields) {
        if (!body[field]) {
          return badRquest(new MissingParamError(field))
        }
      }

      const { email,password,passwordConfirmation,name } = body
      if (password !== passwordConfirmation) {
        return badRquest(new InvalidParamError('passwordConfirmation'))
      }

      const isValidEmail = this.emailValidator.isValid(email)
      if (!isValidEmail) {
        return badRquest(new InvalidParamError('email'))
      }
      const account = this.addAccount.add({
        name,email,password
      })

      return success(account)
    } catch (error) {
      console.error(error)
      return serverError()
    }
  }
}
