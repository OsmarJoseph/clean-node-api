import { InvalidParamError } from '@/presentation/errors'
import { CompareFieldsValidation } from '@/validation/validators'

import faker from 'faker'

const makeSut = (): CompareFieldsValidation => new CompareFieldsValidation('field','field_to_compare')
describe('Compare fields Validation',() => {
  test('Should return a InvalidParamError if validation fails', () => {
    const sut = makeSut()
    const validationError = sut.validate(
      {
        field: faker.random.word(),
        field_to_compare: faker.random.word()
      }
    )
    expect(validationError).toEqual(new InvalidParamError('field_to_compare'))
  })
  test('Should not return if validation succeeds', () => {
    const sut = makeSut()
    const field = faker.random.word()
    const validationError = sut.validate(
      {
        field,
        field_to_compare: field
      })
    expect(validationError).toBeFalsy()
  })
})
