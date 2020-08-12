import { HttpRequest, HttpResponse } from '../protocols/http'
import { MissingParamError } from '../errors/missing-param-error'
import { badRquest } from '../helpers/http-helper'

export class SignUpController {
  handle (httpRequest: HttpRequest): HttpResponse {
    const requiredFields = ['name','email','password']

    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRquest(new MissingParamError(field))
      }
    }
  }
}
