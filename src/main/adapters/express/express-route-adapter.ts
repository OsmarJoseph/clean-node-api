import { Controller, HttpRequest } from '../../../presentation/protocols'
import { Request,Response } from 'express'

export const adaptRoute = (controller: Controller) => {
  return async (req: Request, res: Response) => {
    const httpRequest: HttpRequest = {
      body: req.body
    }
    const httpResponse = await controller.handle(httpRequest)
    const { statusCode,body } = httpResponse
    res.status(statusCode).json(body?.message || body)
  }
}
