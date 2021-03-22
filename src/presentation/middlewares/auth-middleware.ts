import { LoadAccountByToken } from '@/domain/usecases'
import { Middleware, HttpResponse } from '@/presentation/protocols'
import { AccessDeniedError } from '@/presentation/errors'
import {
  forbidenRequest,
  okRequest,
  serverErrorRequest
} from '@/presentation/helpers'

export namespace AuthMiddleware {
  export type Request = {
    accessToken?: string
  }
}

export class AuthMiddleware implements Middleware {
  constructor (
    private readonly loadAccountByToken: LoadAccountByToken,
    private readonly role?: string
  ) {}

  async handle (request: AuthMiddleware.Request): Promise<HttpResponse> {
    try {
      const { accessToken } = request
      if (accessToken) {
        const account = await this.loadAccountByToken.loadByToken(
          accessToken,
          this.role
        )
        if (account) {
          return okRequest({ accountId: account.id })
        }
      }
      return forbidenRequest(new AccessDeniedError())
    } catch (error) {
      return serverErrorRequest(error)
    }
  }
}
