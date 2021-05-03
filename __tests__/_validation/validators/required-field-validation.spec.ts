import { MissingParamError } from '@/presentation/errors'
import { RequiredFiledValidation } from '@/validation/validators'

import faker from 'faker'

const makeSut = (): RequiredFiledValidation => new RequiredFiledValidation('test_field')
describe('Required Field Validation', () => {
  test('Should return a MissingParamError if validation fails', () => {
    const sut = makeSut()
    const validationError = sut.validate({ otherField: faker.random.word() })
    expect(validationError).toEqual(new MissingParamError('test_field'))
  })
  test('Should not return if validation succeeds', () => {
    const sut = makeSut()
    const validationError = sut.validate({ test_field: faker.random.word() })
    expect(validationError).toBeFalsy()
  })
})
