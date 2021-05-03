import { makeLoginValidation } from '@/main/factories'
import { Validation } from '@/presentation/protocols'
import {
  RequiredFiledValidation,
  ValidationComposite,
  EmailValidation,
} from '@/validation/validators'
import { EMailValidatorSpy } from '@/tests/_validation/mocks'
jest.mock('@/validation/validators/validation-composite')

const makeRequiredFields = (): string[] => ['email', 'password']

describe('LoginValidation Factory', () => {
  test('Should call validation with all validations', () => {
    makeLoginValidation()
    const validations: Validation[] = []

    for (const requiredField of makeRequiredFields()) {
      validations.push(new RequiredFiledValidation(requiredField))
    }
    validations.push(new EmailValidation('email', new EMailValidatorSpy()))

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
