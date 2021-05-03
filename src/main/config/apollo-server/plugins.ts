import { GraphQLResponse } from 'apollo-server-types'
import { PluginDefinition } from 'apollo-server-core'
import { GraphQLError } from 'graphql'

export const plugins: PluginDefinition[] = [
  {
    requestDidStart: () => ({
      willSendResponse: ({ response, errors }) => handleErrors(response, errors),
    }),
  },
]

const errorsMap = new Map([
  ['UserInputError', { statusCode: 400 }],
  ['AuthenticationError', { statusCode: 401 }],
  ['ForbiddenError', { statusCode: 403 }],
])

const handleErrors = (response: GraphQLResponse, errors: readonly GraphQLError[]): void => {
  errors?.forEach((error) => {
    response.data = undefined

    for (const [errorName, { statusCode }] of errorsMap) {
      if (checkError(error, errorName)) {
        response.http.status = statusCode
      }
    }
  })
}

const checkError = (error: GraphQLError, errorName: string): boolean => {
  return [error.name, error.originalError?.name].includes(errorName)
}
