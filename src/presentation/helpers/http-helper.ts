import { HttpResponse } from '../protocols/http'
import { ServerError } from '../errors'

export const badRquest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error
})

export const serverError = (error: Error): HttpResponse => ({
  statusCode: 500,
  body: new ServerError(error.stack)
})

export const success = (data: any): HttpResponse => ({
  statusCode: 200,
  body: data

})
