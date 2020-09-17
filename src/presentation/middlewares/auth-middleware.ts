import { AccessDeniedError } from '../errors'
import { forbidenRequest, successResponse, serverErrorResponse } from '../helpers/http/http-helper'
import { Middleware,HttpRequest,HttpResponse , LoadAccountByToken } from './auth-middleware-protocols'

export class AuthMiddleware implements Middleware {
  constructor (
    private readonly loadAccountByToken: LoadAccountByToken,
    private readonly role?: string

  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const accessToken = httpRequest?.headers?.['x-access-token']
      if (accessToken) {
        const account = await this.loadAccountByToken.loadByToken(accessToken,this.role)
        if (account) {
          return successResponse({ accountId: account.id })
        }
      }
      return forbidenRequest(new AccessDeniedError())
    } catch (error) {
      return serverErrorResponse(error)
    }
  }
}
