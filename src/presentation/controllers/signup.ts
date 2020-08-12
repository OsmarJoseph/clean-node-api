import { HttpRequest, HttpResponse } from '../protocols/http'
import { MissingParamError } from '../errors/missing-param-error'
import { badRquest } from '../helpers/http-helper'

export class SignUpController {
  handle (httpRequest: HttpRequest): HttpResponse {
    if (!httpRequest.body.name) {
      return badRquest(new MissingParamError('name'))
    }
    if (!httpRequest.body.email) {
      return badRquest(new MissingParamError('email'))
    }
  }
}
