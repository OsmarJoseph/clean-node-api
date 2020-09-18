import { Validation } from '../../../../../presentation/protocols/validation'
import { RequiredFiledValidation, ValidationComposite } from '../../../../../validation/validators'

export const makeAddSurveyValidation = (): Validation => {
  const validations: Validation[] = []
  const requiredFields = ['question','possibleAnswers']
  for (const requiredField of requiredFields) {
    validations.push(new RequiredFiledValidation(requiredField))
  }

  return new ValidationComposite(validations)
}
