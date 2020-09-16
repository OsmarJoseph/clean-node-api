import { Middleware,HttpRequest,HttpResponse } from '../protocols'
import { AccessDeniedError } from '../errors'
import { forbidenRequest } from '../helpers/http/http-helper'

export class AuthMiddleware implements Middleware {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    return forbidenRequest(new AccessDeniedError())
  }
}
