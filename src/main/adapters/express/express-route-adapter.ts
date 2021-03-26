import { Controller } from '@/presentation/protocols'
import { Request, Response } from 'express'

export const adaptRoute = (controller: Controller): (req: Request, res: Response) => void => {
  const promiseResponse = async (req: Request, res: Response): Promise<void> => {
    const request = {
      ...(req.body || {}),
      ...(req.params || {}),
      accountId: req.accountId
    }
    const httpResponse = await controller.handle(request)
    const { statusCode, body } = httpResponse
    if (statusCode >= 200 && statusCode <= 299) {
      res.status(statusCode).json(body)
    } else {
      res.status(statusCode).json({ error: body?.message })
    }
  }
  return promiseResponse
}
