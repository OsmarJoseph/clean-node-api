import { EmailValidation } from '@/validation/validators'
import { EMailValidatorSpy } from '@/tests/validation-tests/mocks'
import { InvalidParamError } from '@/presentation/errors'
import { throwError } from '@/tests/domain-tests/mocks'

type SutTypes = {
  sut: EmailValidation
  emailValidatorSpy: EMailValidatorSpy
}
const makeSut = (): SutTypes => {
  const emailValidatorSpy = new EMailValidatorSpy()
  const sut = new EmailValidation('email',emailValidatorSpy)
  return {
    sut,
    emailValidatorSpy
  }
}
describe('Email Validation',() => {
  test('Should return an error if EmailValidator returns false', () => {
    const { sut,emailValidatorSpy } = makeSut()
    emailValidatorSpy.isValid = () => false
    const validationError = sut.validate({ email: 'any_mail@mail.com' })
    expect(validationError).toEqual(new InvalidParamError('email'))
  })

  test('Should call EmailValidator with correct email', () => {
    const { sut,emailValidatorSpy } = makeSut()
    sut.validate({ email: 'any_mail@mail.com' })
    expect(emailValidatorSpy.email).toBe('any_mail@mail.com')
  })

  test('Should throw if EmailValidator throws', () => {
    const { sut,emailValidatorSpy } = makeSut()
    emailValidatorSpy.isValid = throwError
    expect(sut.validate).toThrow()
  })
})
