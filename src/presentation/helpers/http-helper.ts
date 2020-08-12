import { HttpResponse } from '../protocols/http'

export const badRquest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error
})
