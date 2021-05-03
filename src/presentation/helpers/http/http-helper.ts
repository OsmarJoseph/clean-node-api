import { HttpResponse } from '@/presentation/protocols/'
import { ServerError, UnauthorizedError } from '@/presentation/errors'

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error,
})

export const forbidenRequest = (error: Error): HttpResponse => ({
  statusCode: 403,
  body: error,
})

export const unauthorizedRequest = (): HttpResponse => ({
  statusCode: 401,
  body: new UnauthorizedError(),
})

export const serverErrorRequest = (error: Error): HttpResponse => ({
  statusCode: 500,
  body: new ServerError(error.stack),
})

export const okRequest = (data: any): HttpResponse => ({
  statusCode: 200,
  body: data,
})

export const noContentRequest = (): HttpResponse => ({
  statusCode: 204,
  body: null,
})
