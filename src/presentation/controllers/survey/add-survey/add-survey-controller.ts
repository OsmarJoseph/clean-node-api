import { HttpRequest,Controller, HttpResponse, Validation, AddSurvey } from './add-survey-protocols'
import { badRequest } from '../../../helpers/http/http-helper'

export class AddSurveyController implements Controller {
  constructor (
    private readonly validation: Validation,
    private readonly addSurvey: AddSurvey
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const { body } = httpRequest
    const validationError = this.validation.validate(body)
    if (validationError) {
      return badRequest(validationError)
    }
    const { question,possibleAnswers } = body
    await this.addSurvey.add({ question,possibleAnswers })
    return null
  }
}
