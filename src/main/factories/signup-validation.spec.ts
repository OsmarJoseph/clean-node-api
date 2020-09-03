import { makeSignUpValidation } from './signup-validation'
import { ValidationComposite } from '../../presentation/helpers/validators/validation-composite'
import { RequiredFiledValidation } from '../../presentation/helpers/validators/required-field-validation'
import { Validation } from '../../presentation/helpers/validators/validation'
jest.mock('../../presentation/helpers/validators/validation-composite')

const makeRequiredFields = (): string[] => ['name','email','password','passwordConfirmation']

describe('SignUpValidation Factory',() => {
  test('Should call validation with all validations',() => {
    makeSignUpValidation()
    const validations: Validation[] = []

    for (const requiredField of makeRequiredFields()) {
      validations.push(new RequiredFiledValidation(requiredField))
    }
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
