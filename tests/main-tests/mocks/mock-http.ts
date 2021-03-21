import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { okRequest } from '@/presentation/helpers'

import faker from 'faker'

export const mockResponse = (): HttpResponse =>
  okRequest({
    any_field: faker.random.words()
  })

export class ControllerSpy implements Controller {
  result = mockResponse()
  httpRequest: HttpRequest
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    this.httpRequest = httpRequest
    return this.result
  }
}

export const mockRequest = (): HttpRequest => ({
  body: {
    any_field: faker.random.words()
  }
})
