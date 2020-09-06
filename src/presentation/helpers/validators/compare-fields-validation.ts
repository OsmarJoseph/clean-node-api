import { Validation } from '../../protocols/validation'
import { InvalidParamError } from '../../errors'

export class CompareFieldsValidation implements Validation {
  constructor (
    private readonly fieldName: string,
    private readonly fieldToCompareName: string
  ) {}

  validate (input: any): Error {
    const { fieldName,fieldToCompareName } = this
    if (input[fieldName] !== input[fieldToCompareName]) {
      return new InvalidParamError(fieldToCompareName)
    }
  }
}
