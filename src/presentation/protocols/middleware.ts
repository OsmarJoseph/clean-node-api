import { HttpResponse } from './http'

export interface Middleware<Request = any> {
  handle: (request: Request) => Promise<HttpResponse>
}
