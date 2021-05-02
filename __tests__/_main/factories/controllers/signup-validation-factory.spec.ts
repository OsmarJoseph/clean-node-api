import { Validation } from '@/presentation/protocols'
import { RequiredFiledValidation, CompareFieldsValidation, EmailValidation, ValidationComposite } from '@/validation/validators'
import { makeSignUpValidation } from '@/main/factories'
import { EMailValidatorSpy } from '@/tests/_validation/mocks'
jest.mock('@/validation/validators/validation-composite')

const makeRequiredFields = (): string[] => ['name','email','password','passwordConfirmation']

describe('SignUpValidation Factory',() => {
  test('Should call validation with all validations',() => {
    makeSignUpValidation()
    const validations: Validation[] = []

    for (const requiredField of makeRequiredFields()) {
      validations.push(new RequiredFiledValidation(requiredField))
    }
    validations.push(new CompareFieldsValidation('password','passwordConfirmation'))
    validations.push(new EmailValidation('email', new EMailValidatorSpy()))

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
