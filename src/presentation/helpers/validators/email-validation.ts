import { Validation } from './validation'
import { InvalidParamError } from '../../errors'
import { EmailValidator } from '../../protocols/email-validator'

export class EmailValidation implements Validation {
  constructor (
    private readonly fieldName: string,
    private readonly emailValidator: EmailValidator
  ) {}

  validate (input: any): Error {
    const { fieldName, emailValidator } = this
    const isValidEmail = emailValidator.isValid(input[fieldName])
    if (!isValidEmail) {
      return new InvalidParamError(fieldName)
    }
  }
}