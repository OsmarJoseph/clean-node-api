import { Validation } from '../../../presentation/protocols/validation'
import { EmailValidatorAdapter } from '../../../utils/email-validator-adapter'
import { RequiredFiledValidation, CompareFieldsValidation, EmailValidation, ValidationComposite } from '../../../presentation/helpers/validators'

export const makeSignUpValidation = (): Validation => {
  const validations: Validation[] = []
  const requiredFields = ['name','email','password','passwordConfirmation']
  for (const requiredField of requiredFields) {
    validations.push(new RequiredFiledValidation(requiredField))
  }
  validations.push(new CompareFieldsValidation('password','passwordConfirmation'))
  validations.push(new EmailValidation('email',new EmailValidatorAdapter()))

  return new ValidationComposite(validations)
}
