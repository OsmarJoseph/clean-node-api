import { resolvers } from '@/main/graphql/resolvers'
import { typeDefs } from '@/main/graphql/type-defs'

import { ApolloServer } from 'apollo-server-express'
import { GraphQLResponse } from 'apollo-server-types'
import { Express } from 'express'
import { GraphQLError } from 'graphql'

export const setupApolloServer = (app: Express): void => {
  const server = new ApolloServer({
    resolvers,
    typeDefs,
    plugins: [{
      requestDidStart: () => ({
        willSendResponse: ({ response,errors }) => handleErrors(response, errors)
      })
    }]
  })
  server.applyMiddleware({ app })
}

const errorsMap = new Map([
  ['UserInputError',{ statusCode: 400 }],
  ['AuthenticationError',{ statusCode: 401 }],
  ['ForbiddenError',{ statusCode: 403 }]
])

const handleErrors = (response: GraphQLResponse, errors: readonly GraphQLError[]): void => {
  errors?.forEach(error => {
    response.data = undefined

    for (const [errorName, { statusCode }] of errorsMap) {
      if (checkError(error,errorName)) {
        response.http.status = statusCode
      }
    }
  })
}

const checkError = (error: GraphQLError,errorName: string): boolean => {
  return [error.name,error.originalError?.name].includes(errorName)
}
