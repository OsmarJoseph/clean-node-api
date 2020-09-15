import { RequiredFiledValidation } from './required-field-validation'
import { MissingParamError } from '../../presentation/errors'

const makeSut = (): RequiredFiledValidation => new RequiredFiledValidation('test_field')
describe('Required Field Validation',() => {
  test('Should return a MissingParamError if validation fails', () => {
    const sut = makeSut()
    const validationError = sut.validate({ otherField: 'any_other_field' })
    expect(validationError).toEqual(new MissingParamError('test_field'))
  })
  test('Should not return if validation succeeds', () => {
    const sut = makeSut()
    const validationError = sut.validate({ test_field: 'any_value' })
    expect(validationError).toBeFalsy()
  })
})
