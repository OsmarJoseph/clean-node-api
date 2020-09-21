import { EmailValidator } from '@/validation/protocols/email-validator'
import { EmailValidation } from './email-validation'
import { InvalidParamError } from '@/presentation/errors'

const makeEmailValidator = (): EmailValidator => {
  class EMailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EMailValidatorStub()
}

interface SutTypes {
  sut: EmailValidation
  emailValidatorStub: EmailValidator
}
const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const sut = new EmailValidation('email',emailValidatorStub)
  return {
    sut,
    emailValidatorStub
  }
}
describe('Email Validation',() => {
  test('Should return an error if EmailValidator returns false', () => {
    const { sut,emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub,'isValid').mockReturnValueOnce(false)
    const validationError = sut.validate({ email: 'any_mail@mail.com' })
    expect(validationError).toEqual(new InvalidParamError('email'))
  })

  test('Should call EmailValidator with correct email', () => {
    const { sut,emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub,'isValid')
    sut.validate({ email: 'any_mail@mail.com' })
    expect(isValidSpy).toHaveBeenCalledWith('any_mail@mail.com')
  })

  test('Should throw if EmailValidator throws', () => {
    const { sut,emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub,'isValid').mockImplementationOnce(() => {
      throw new Error()
    })
    expect(sut.validate).toThrow()
  })
})
