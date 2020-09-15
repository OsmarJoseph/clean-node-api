import { HttpRequest,Controller, HttpResponse, Validation } from '../../../protocols'
import { badRequest } from '../../../helpers/http/http-helper'

export class AddSurveyController implements Controller {
  constructor (
    private readonly validation: Validation
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const { body } = httpRequest
    const validationError = this.validation.validate(body)
    if (validationError) {
      return badRequest(validationError)
    }
    return null
  }
}
