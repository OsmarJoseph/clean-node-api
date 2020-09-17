import { Middleware,HttpRequest,HttpResponse } from '../protocols'
import { AccessDeniedError } from '../errors'
import { forbidenRequest } from '../helpers/http/http-helper'
import { LoadAccountByToken } from '../../domain/usecases/load-account-by-token'

export class AuthMiddleware implements Middleware {
  constructor (
    private readonly loadAccountByToken: LoadAccountByToken
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const accessToken = httpRequest?.headers?.['x-access-token']
    if (accessToken) {
      await this.loadAccountByToken.loadByToken(accessToken)
    }
    return forbidenRequest(new AccessDeniedError())
  }
}
