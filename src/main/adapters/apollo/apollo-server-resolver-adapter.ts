import { Controller } from '@/presentation/protocols'

export const adaptResolver = async (controller: Controller,args: unknown): Promise<unknown> => {
  const httpResponse = await controller.handle(args)
  return httpResponse.body
}
