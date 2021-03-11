import { InvalidParamError } from '@/presentation/errors'
import { CompareFieldsValidation } from '@/validation/validators'

const makeSut = (): CompareFieldsValidation => new CompareFieldsValidation('field','field_to_compare')
describe('Compare fields Validation',() => {
  test('Should return a InvalidParamError if validation fails', () => {
    const sut = makeSut()
    const validationError = sut.validate({ field: 'any_value',field_to_compare: 'wrong_value' })
    expect(validationError).toEqual(new InvalidParamError('field_to_compare'))
  })
  test('Should not return if validation succeeds', () => {
    const sut = makeSut()
    const validationError = sut.validate({ field: 'any_value',field_to_compare: 'any_value' })
    expect(validationError).toBeFalsy()
  })
})
