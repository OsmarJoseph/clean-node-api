import { setupMiddlewares } from './middlewares'
import { setupRoutes } from './routes'
import { setupSwagger } from './swagger/swagger'
import { setupApolloServer } from './apollo-server'

import express from 'express'

const app = express()

setupSwagger(app)
setupMiddlewares(app)
setupRoutes(app)
setupApolloServer(app)

export { app }
