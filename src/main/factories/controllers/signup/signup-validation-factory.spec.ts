import { makeSignUpValidation } from './signup-validation-factory'
import { Validation } from '../../../../presentation/protocols/validation'
import { EmailValidator } from '../../../../validation/protocols/email-validator'
import { RequiredFiledValidation, CompareFieldsValidation, EmailValidation, ValidationComposite } from '../../../../validation/validators'
jest.mock('../../../../validation/validators/validation-composite')

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
