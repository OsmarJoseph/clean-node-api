import { ValidationComposite } from './validation-composite'
import { makeMockValidation } from '@/validation/test'
import { MissingParamError } from '@/presentation/errors'
import { Validation } from '@/presentation/protocols'

type SutTypes = {
  sut: ValidationComposite
  validationStubs: Validation[]
}
const makeSut = (): SutTypes => {
  const validationStubs = [makeMockValidation(),makeMockValidation()]
  const sut = new ValidationComposite(validationStubs)
  return {
    sut,
    validationStubs
  }
}

describe('Validation Composite', () => {
  test('Should return an error if any validation fails', () => {
    const { sut,validationStubs } = makeSut()
    jest.spyOn(validationStubs[1],'validate').mockReturnValueOnce((new MissingParamError('test_field')))
    const validationError = sut.validate({ test_field: 'any_value' })
    expect(validationError).toEqual(new MissingParamError('test_field'))
  })
  test('Should return the first error if more than one validation fails', () => {
    const { sut,validationStubs } = makeSut()
    jest.spyOn(validationStubs[0],'validate').mockReturnValueOnce((new Error()))
    jest.spyOn(validationStubs[1],'validate').mockReturnValueOnce((new MissingParamError('test_field')))
    const validationError = sut.validate({ test_field: 'any_value' })
    expect(validationError).toEqual(new Error())
  })
  test('Should not return if validation succeeds', () => {
    const { sut } = makeSut()
    const validationError = sut.validate({ test_field: 'any_value' })
    expect(validationError).toBeFalsy()
  })
})
