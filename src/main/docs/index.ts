import { loginPath,surveyPath } from './paths'
import {
  accessSchema,
  loginParamsSchema,
  errorSchema,
  surveySchema,
  surveyAnswerSchema,
  surveysListSchema,
  apiKeyAuthSchema
} from './schemas'
import {
  badRequestComponent,
  unauthorizedRequestComponent,
  serverErrorComponent,
  notFoundComponent,
  forbidenRequestComponent
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
  },{
    name: 'Enquete'
  }],
  paths: {
    '/login': loginPath,
    '/surveys': surveyPath

  },
  schemas: {
    accessSchema,
    loginParamsSchema,
    errorSchema,
    surveySchema,
    surveyAnswerSchema,
    surveysListSchema
  },
  components: {
    securitySchemes: {
      apiKeyAuthSchema
    },
    badRequestComponent,
    unauthorizedRequestComponent,
    serverErrorComponent,
    notFoundComponent,
    forbidenRequestComponent
  }
}
