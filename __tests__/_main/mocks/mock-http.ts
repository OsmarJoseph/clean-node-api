import { Controller, HttpResponse } from '@/presentation/protocols'
import { okRequest } from '@/presentation/helpers'

import faker from 'faker'

export const mockResponse = (): HttpResponse =>
  okRequest({
    any_field: faker.random.words()
  })

export class ControllerSpy implements Controller {
  result = mockResponse()
  request: any
  async handle (request: any): Promise<HttpResponse> {
    this.request = request
    return this.result
  }
}
