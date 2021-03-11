import { EmailValidation } from '@/validation/validators'
import { EmailValidator } from '@/validation/protocols'
import { makeMockEmailValidator } from '@/tests/validation-tests/mocks'
import { InvalidParamError } from '@/presentation/errors'
import { throwError } from '@/tests/domain-tests/mocks'

type SutTypes = {
  sut: EmailValidation
  emailValidatorStub: EmailValidator
}
const makeSut = (): SutTypes => {
  const emailValidatorStub = makeMockEmailValidator()
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
    jest.spyOn(emailValidatorStub,'isValid').mockImplementationOnce(throwError)
    expect(sut.validate).toThrow()
  })
})
