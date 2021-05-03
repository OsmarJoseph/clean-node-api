import { ValidationComposite } from '@/validation/validators'
import { ValidationSpy } from '@/tests/_validation/mocks'
import { MissingParamError } from '@/presentation/errors'

import faker from 'faker'

type SutTypes = {
  sut: ValidationComposite
  validationSpies: ValidationSpy[]
}
const makeSut = (): SutTypes => {
  const validationSpies = [new ValidationSpy(), new ValidationSpy()]
  const sut = new ValidationComposite(validationSpies)
  return {
    sut,
    validationSpies,
  }
}

describe('Validation Composite', () => {
  test('Should return an error if any validation fails', () => {
    const { sut, validationSpies } = makeSut()
    validationSpies[1].result = new MissingParamError('test_field')
    const validationError = sut.validate({ test_field: faker.random.word() })
    expect(validationError).toEqual(new MissingParamError('test_field'))
  })
  test('Should return the first error if more than one validation fails', () => {
    const { sut, validationSpies } = makeSut()
    validationSpies[0].result = new Error()
    validationSpies[1].result = new MissingParamError('test_field')
    const validationError = sut.validate({ test_field: faker.random.word() })
    expect(validationError).toEqual(new Error())
  })
  test('Should not return if validation succeeds', () => {
    const { sut } = makeSut()
    const validationError = sut.validate({ test_field: faker.random.word() })
    expect(validationError).toBeFalsy()
  })
})
