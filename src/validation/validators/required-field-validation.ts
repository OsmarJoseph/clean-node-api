import { Validation } from '@/presentation/protocols'
import { MissingParamError } from '@/presentation/errors'

export class RequiredFiledValidation implements Validation {
  constructor (private readonly fieldName: string) {}
  validate (input: any): Error {
    const { fieldName } = this
    if (!input[fieldName]) {
      return new MissingParamError(fieldName)
    }
  }
}
