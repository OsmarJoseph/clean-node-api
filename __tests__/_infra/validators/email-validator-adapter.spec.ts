import { EmailValidatorAdapter } from '@/infra/validators'
import validator from 'validator'
import faker from 'faker'

jest.mock('validator',() => ({
  isEmail (): boolean {
    return true
  }
}))

const makeSut = (): EmailValidatorAdapter => {
  return new EmailValidatorAdapter()
}

describe('EmailValidator Adapter',() => {
  let mockEmail = faker.internet.email()

  beforeEach(() => {
    mockEmail = faker.internet.email()
  })

  test('Should return false if validator return false',() => {
    const sut = makeSut()
    jest.spyOn(validator,'isEmail').mockReturnValueOnce(false)
    const isValid = sut.isValid(mockEmail)
    expect(isValid).toBe(false)
  })
  test('Should return true if validator return true',() => {
    const sut = makeSut()
    const isValid = sut.isValid(mockEmail)
    expect(isValid).toBe(true)
  })
  test('Should call validator with correct email',() => {
    const sut = makeSut()
    const isEmailSpy = jest.spyOn(validator,'isEmail')
    sut.isValid(mockEmail)
    expect(isEmailSpy).toHaveBeenCalledWith(mockEmail)
  })
})
