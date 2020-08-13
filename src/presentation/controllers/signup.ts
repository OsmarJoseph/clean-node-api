import { HttpRequest, HttpResponse } from '../protocols/http'
import { MissingParamError,InvalidParamError } from '../errors'
import { badRquest,serverError } from '../helpers/http-helper'
import { Controller } from '../protocols/controllers'
import { EmailValidator } from '../protocols/email-validator'

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator

  constructor (emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
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
      const isValidEmail = this.emailValidator.isValid(body.email)
      if (!isValidEmail) {
        return badRquest(new InvalidParamError('email'))
      }
    } catch (error) {
      console.error(error)
      return serverError()
    }
  }
}
