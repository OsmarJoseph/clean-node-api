import { loginPath } from './paths'
import { accountSchema, loginParamsSchema,errorSchema } from './schemas'
import {
  badRequestComponent,
  unauthorizedRequestComponent,
  serverErrorComponent,
  notFoundComponent
} from './components'

export const docsConfig = {
  openapi: '3.0.0',
  info: {
    title: 'Clean Node API',
    description: 'API para realizar enquetes',
    version: '1.0'
  },
  servers: [{
    url: '/api'
  }],
  tags: [{
    name: 'Login'
  }],
  paths: {
    '/login': loginPath
  },
  schemas: {
    accountSchema,
    loginParamsSchema,
    errorSchema
  },
  components: {
    badRequestComponent,
    unauthorizedRequestComponent,
    serverErrorComponent,
    notFoundComponent
  }
}
