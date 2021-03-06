import { Validation } from '@/presentation/protocols/validation'
import { EmailValidatorAdapter } from '@/infra/validators/email-validator/email-validator-adapter'
import { RequiredFiledValidation, EmailValidation, ValidationComposite } from '@/validation/validators'

export const makeLoginValidation = (): Validation => {
  const validations: Validation[] = []
  const requiredFields = ['email','password']
  for (const requiredField of requiredFields) {
    validations.push(new RequiredFiledValidation(requiredField))
  }
  validations.push(new EmailValidation('email',new EmailValidatorAdapter()))

  return new ValidationComposite(validations)
}
