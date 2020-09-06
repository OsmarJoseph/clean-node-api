import { makeSignUpValidation } from './signup-validation'
import { ValidationComposite } from '../../../presentation/helpers/validators/validation-composite'
import { RequiredFiledValidation } from '../../../presentation/helpers/validators/required-field-validation'
import { Validation } from '../../../presentation/helpers/validators/validation'
import { CompareFieldsValidation } from '../../../presentation/helpers/validators/compare-fields-validation'
import { EmailValidation } from '../../../presentation/helpers/validators/email-validation'
import { EmailValidator } from '../../../presentation/protocols/email-validator'
jest.mock('../../../presentation/helpers/validators/validation-composite')

const makeRequiredFields = (): string[] => ['name','email','password','passwordConfirmation']

const makeEmailValidator = (): EmailValidator => {
  class EMailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EMailValidatorStub()
}

describe('SignUpValidation Factory',() => {
  test('Should call validation with all validations',() => {
    makeSignUpValidation()
    const validations: Validation[] = []

    for (const requiredField of makeRequiredFields()) {
      validations.push(new RequiredFiledValidation(requiredField))
    }
    validations.push(new CompareFieldsValidation('password','passwordConfirmation'))
    validations.push(new EmailValidation('email',makeEmailValidator()))

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
