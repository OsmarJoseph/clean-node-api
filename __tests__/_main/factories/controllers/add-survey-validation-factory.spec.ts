import { makeAddSurveyValidation } from '@/main/factories'
import { Validation } from '@/presentation/protocols'
import { RequiredFiledValidation, ValidationComposite } from '@/validation/validators'
jest.mock('@/validation/validators/validation-composite')

const makeRequiredFields = (): string[] => ['question', 'possibleAnswers']

describe('Add Survey Validation Factory', () => {
  test('Should call validation with all validations', () => {
    makeAddSurveyValidation()
    const validations: Validation[] = []

    for (const requiredField of makeRequiredFields()) {
      validations.push(new RequiredFiledValidation(requiredField))
    }

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
