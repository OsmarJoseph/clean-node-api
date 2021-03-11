import { Validation } from '@/presentation/protocols'
import { InvalidParamError } from '@/presentation/errors'
import { EmailValidator } from '@/validation/protocols'

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
