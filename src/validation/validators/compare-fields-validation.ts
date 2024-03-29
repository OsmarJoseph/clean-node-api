import { Validation } from '@/presentation/protocols'
import { InvalidParamError } from '@/presentation/errors'

export class CompareFieldsValidation implements Validation {
  constructor(private readonly fieldName: string, private readonly fieldToCompareName: string) {}

  validate(input: any): Error {
    const { fieldName, fieldToCompareName } = this
    if (input[fieldName] !== input[fieldToCompareName]) {
      return new InvalidParamError(fieldToCompareName)
    }
  }
}
