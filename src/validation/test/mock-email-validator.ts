import { EmailValidator } from '@/validation/protocols/email-validator'

export const makeMockEmailValidator = (): EmailValidator => {
  class EMailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EMailValidatorStub()
}
