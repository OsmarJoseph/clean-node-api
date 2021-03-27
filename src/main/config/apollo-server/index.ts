import { plugins } from './plugins'
import { context } from './context'
import { resolvers } from '@/main/graphql/resolvers'
import { typeDefs } from '@/main/graphql/type-defs'
import { schemaDirectives } from '@/main/graphql/directives'

import { ApolloServer } from 'apollo-server-express'
import { Express } from 'express'

export const setupApolloServer = (app: Express): void => {
  const server = new ApolloServer({
    resolvers,
    typeDefs,
    context,
    schemaDirectives,
    plugins
  })
  server.applyMiddleware({ app })
}
