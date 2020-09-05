import { ValidationComposite } from './validation-composite'
import { MissingParamError } from '../../errors'
import { Validation } from './validation'

const makeValidationStub = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error {
      return null
    }
  }
  return new ValidationStub()
}
interface SutTypes {
  sut: ValidationComposite
  validationStub: Validation
}
const makeSut = (): SutTypes => {
  const validationStub = makeValidationStub()
  const sut = new ValidationComposite([validationStub])
  return {
    sut,
    validationStub
  }
}

describe('Validation Composite', () => {
  test('Should return an error if any validation fails', () => {
    const { sut,validationStub } = makeSut()
    jest.spyOn(validationStub,'validate').mockReturnValueOnce((new MissingParamError('test_field')))
    const validationError = sut.validate({ test_field: 'any_value' })
    expect(validationError).toEqual(new MissingParamError('test_field'))
  })
})
