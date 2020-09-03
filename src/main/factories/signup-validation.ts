import { ValidationComposite } from '../../presentation/helpers/validators/validation-composite'
import { Validation } from '../../presentation/helpers/validators/validation'
import { RequiredFiledValidation } from '../../presentation/helpers/validators/required-field-validation'

export const makeSignUpValidation = (): Validation => {
  const validations: Validation[] = []
  const requiredFields = ['name','email','password','passwordConfirmation']
  for (const requiredField of requiredFields) {
    validations.push(new RequiredFiledValidation(requiredField))
  }
  return new ValidationComposite(validations)
}
