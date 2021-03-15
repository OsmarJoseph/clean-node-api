import { ValidationComposite } from '@/validation/validators'
import { ValidationSpy } from '@/tests/validation-tests/mocks'
import { MissingParamError } from '@/presentation/errors'
import { Validation } from '@/presentation/protocols'

type SutTypes = {
  sut: ValidationComposite
  validationSpies: Validation[]
}
const makeSut = (): SutTypes => {
  const validationSpies = [new ValidationSpy(),new ValidationSpy()]
  const sut = new ValidationComposite(validationSpies)
  return {
    sut,
    validationSpies
  }
}

describe('Validation Composite', () => {
  test('Should return an error if any validation fails', () => {
    const { sut,validationSpies } = makeSut()
    jest.spyOn(validationSpies[1],'validate').mockReturnValueOnce((new MissingParamError('test_field')))
    const validationError = sut.validate({ test_field: 'any_value' })
    expect(validationError).toEqual(new MissingParamError('test_field'))
  })
  test('Should return the first error if more than one validation fails', () => {
    const { sut,validationSpies } = makeSut()
    jest.spyOn(validationSpies[0],'validate').mockReturnValueOnce((new Error()))
    jest.spyOn(validationSpies[1],'validate').mockReturnValueOnce((new MissingParamError('test_field')))
    const validationError = sut.validate({ test_field: 'any_value' })
    expect(validationError).toEqual(new Error())
  })
  test('Should not return if validation succeeds', () => {
    const { sut } = makeSut()
    const validationError = sut.validate({ test_field: 'any_value' })
    expect(validationError).toBeFalsy()
  })
})
