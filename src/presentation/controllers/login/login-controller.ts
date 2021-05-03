import { Authentication } from '@/domain/usecases'
import { Controller, Validation, HttpResponse } from '@/presentation/protocols'
import {
  badRequest,
  serverErrorRequest,
  unauthorizedRequest,
  okRequest,
} from '@/presentation/helpers'

export namespace LoginController {
  export type Request = {
    email: string
    password: string
  }
}

export class LoginController implements Controller {
  constructor(
    private readonly authentication: Authentication,
    private readonly validation: Validation,
  ) {}

  async handle(request: LoginController.Request): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(request)
      if (error) {
        return badRequest(error)
      }
      const { email, password } = request
      const accessToken = await this.authentication.auth({ email, password })
      if (!accessToken) {
        return unauthorizedRequest()
      }
      return okRequest({ accessToken })
    } catch (error) {
      return serverErrorRequest(error)
    }
  }
}
