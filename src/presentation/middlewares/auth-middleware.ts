import { LoadAccountIdByToken } from '@/domain/usecases'
import { Middleware, HttpResponse } from '@/presentation/protocols'
import { AccessDeniedError } from '@/presentation/errors'
import { forbidenRequest, okRequest, serverErrorRequest } from '@/presentation/helpers'

export namespace AuthMiddleware {
  export type Request = {
    accessToken?: string
  }
}

export class AuthMiddleware implements Middleware {
  constructor(
    private readonly loadAccountIdByToken: LoadAccountIdByToken,
    private readonly role?: string,
  ) {}

  async handle(request: AuthMiddleware.Request): Promise<HttpResponse> {
    try {
      const { accessToken } = request
      if (accessToken) {
        const accountId = await this.loadAccountIdByToken.loadAccountIdByToken(
          accessToken,
          this.role,
        )
        if (accountId) {
          return okRequest({ accountId })
        }
      }
      return forbidenRequest(new AccessDeniedError())
    } catch (error) {
      return serverErrorRequest(error)
    }
  }
}
