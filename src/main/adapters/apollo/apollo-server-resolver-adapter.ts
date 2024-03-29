import { Controller } from '@/presentation/protocols'
import {
  UserInputError,
  AuthenticationError,
  ApolloError,
  ForbiddenError,
} from 'apollo-server-express'

export const adaptResolver = async (
  controller: Controller,
  args?: any,
  context?: any,
): Promise<unknown> => {
  const request = {
    ...(args || {}),
    accountId: context?.req.accountId,
  }
  const httpResponse = await controller.handle(request)
  const { statusCode, body } = httpResponse
  const errorMessage = body?.message

  switch (statusCode) {
    case 200:
    case 204:
      return body
    case 400:
      throw new UserInputError(errorMessage)
    case 401:
      throw new AuthenticationError(errorMessage)
    case 403:
      throw new ForbiddenError(errorMessage)
    default:
      throw new ApolloError(errorMessage)
  }
}
