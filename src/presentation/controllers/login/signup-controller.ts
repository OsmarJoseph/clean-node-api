import { AddAccount, Authentication } from '@/domain/usecases'
import { Controller, Validation, HttpResponse } from '@/presentation/protocols'
import { badRequest, serverErrorRequest, okRequest, forbidenRequest } from '@/presentation/helpers'
import { ParamInUseError } from '@/presentation/errors'

export namespace SignUpController {
  export type Request = {
    email: string
    name: string
    password: string
    passwordConfirmation: string
  }
}
export class SignUpController implements Controller {
  constructor(
    private readonly addAccount: AddAccount,
    private readonly validation: Validation,
    private readonly authentication: Authentication,
  ) {}

  async handle(request: SignUpController.Request): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(request)
      if (error) {
        return badRequest(error)
      }

      const { email, password, name } = request

      const isValid = await this.addAccount.add({
        name,
        email,
        password,
      })
      if (!isValid) {
        return forbidenRequest(new ParamInUseError('email'))
      }

      const accessToken = await this.authentication.auth({
        email,
        password,
      })

      return okRequest({ accessToken })
    } catch (error) {
      console.error(error)
      return serverErrorRequest(error)
    }
  }
}
