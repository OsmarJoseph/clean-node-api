import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { okRequest } from '@/presentation/helpers'

export const makeMockResponse = (): HttpResponse =>
  okRequest({
    any_field: 'any_value'
  })

export class ControllerSpy implements Controller {
  result = makeMockResponse()
  httpRequest: HttpRequest
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    this.httpRequest = httpRequest
    return this.result
  }
}

export const makeMockRequest = (): HttpRequest => ({
  body: {
    any_field: 'any_value'
  }
})
