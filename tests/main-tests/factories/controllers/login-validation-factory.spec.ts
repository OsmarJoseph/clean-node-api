import { makeLoginValidation } from '@/main/factories'
import { Validation } from '@/presentation/protocols'
import { EmailValidator } from '@/validation/protocols'
import { RequiredFiledValidation, ValidationComposite, EmailValidation } from '@/validation/validators'
jest.mock('@/validation/validators/validation-composite')

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
