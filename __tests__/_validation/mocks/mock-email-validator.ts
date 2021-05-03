import { EmailValidator } from '@/validation/protocols'

export class EMailValidatorSpy implements EmailValidator {
  email: string
  isValid(email: string): boolean {
    this.email = email
    return true
  }
}
