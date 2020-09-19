import { HttpResponse } from '../../protocols/http'
import { ServerError, UnauthorizedError } from '../../errors'

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error
})

export const forbidenRequest = (error: Error): HttpResponse => ({
  statusCode: 403,
  body: error
})

export const unauthorizedRequest = (): HttpResponse => ({
  statusCode: 401,
  body: new UnauthorizedError()
})

export const serverErrorResponse = (error: Error): HttpResponse => ({
  statusCode: 500,
  body: new ServerError(error.stack)
})

export const okRequest = (data: any): HttpResponse => ({
  statusCode: 200,
  body: data
})

export const noContentResponse = (): HttpResponse => ({
  statusCode: 204,
  body: null
})
