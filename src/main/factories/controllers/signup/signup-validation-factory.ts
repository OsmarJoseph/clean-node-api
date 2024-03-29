import { Validation } from '@/presentation/protocols'
import { EmailValidatorAdapter } from '@/infra/validators'
import {
  RequiredFiledValidation,
  CompareFieldsValidation,
  EmailValidation,
  ValidationComposite,
} from '@/validation/validators'

export const makeSignUpValidation = (): Validation => {
  const validations: Validation[] = []
  const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
  for (const requiredField of requiredFields) {
    validations.push(new RequiredFiledValidation(requiredField))
  }
  validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'))
  validations.push(new EmailValidation('email', new EmailValidatorAdapter()))

  return new ValidationComposite(validations)
}
