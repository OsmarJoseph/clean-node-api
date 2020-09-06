import { makeLoginValidation } from './login-validation'
import { Validation } from '../../../presentation/protocols/validation'
import { EmailValidator } from '../../../presentation/protocols/email-validator'
import { RequiredFiledValidation, ValidationComposite, EmailValidation } from '../../../presentation/helpers/validators'
jest.mock('../../../presentation/helpers/validators/validation-composite')

const makeRequiredFields = (): string[] => ['email','password']

const makeEmailValidator = (): EmailValidator => {
  class EMailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EMailValidatorStub()
}

describe('LoginValidation Factory',() => {
  test('Should call validation with all validations',() => {
    makeLoginValidation()
    const validations: Validation[] = []

    for (const requiredField of makeRequiredFields()) {
      validations.push(new RequiredFiledValidation(requiredField))
    }
    validations.push(new EmailValidation('email',makeEmailValidator()))

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
