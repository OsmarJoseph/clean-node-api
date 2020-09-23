import { Controller, HttpRequest } from '@/presentation/protocols'
import { Request,Response } from 'express'

export const adaptRoute = (controller: Controller) => {
  return async (req: Request, res: Response) => {
    const httpRequest: HttpRequest = {
      body: req.body,
      params: req.params,
      accountId: req.accountId
    }
    const httpResponse = await controller.handle(httpRequest)
    const { statusCode,body } = httpResponse
    if (statusCode >= 200 && statusCode <= 299) {
      res.status(statusCode).json(body)
    } else {
      res.status(statusCode).json({ error: body?.message })
    }
  }
}
