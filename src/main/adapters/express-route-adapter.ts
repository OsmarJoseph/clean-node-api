import { Controller, HttpRequest } from '../../presentation/protocols'
import { Request,Response } from 'express'

export const adaptRoute = (controller: Controller) => {
  return async (req: Request, res: Response) => {
    const httpRequest: HttpRequest = {
      body: req.body
    }
    const httpResponse = await controller.handle(httpRequest)
    const { statusCode,body } = httpResponse
    if (statusCode === 200) {
      res.status(statusCode).json(body)
    } else {
      res.status(statusCode).json({ error: body.message })
    }
  }
}
