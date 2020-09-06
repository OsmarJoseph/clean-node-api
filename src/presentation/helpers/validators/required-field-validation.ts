import { Validation } from '../../protocols/validation'
import { MissingParamError } from '../../errors'

export class RequiredFiledValidation implements Validation {
  constructor (private readonly fieldName: string) {}
  validate (input: any): Error {
    const { fieldName } = this
    if (!input[fieldName]) {
      return new MissingParamError(fieldName)
    }
  }
}
