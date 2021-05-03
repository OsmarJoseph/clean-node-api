import { loginPath, surveyPath, signUpPath, surveyResultPath } from './paths'
import * as schemas from './schemas'
import * as components from './components'
export const docsConfig = {
  openapi: '3.0.0',
  info: {
    title: 'Clean Node API',
    description: 'API para realizar enquetes',
    version: '1.0',
  },
  servers: [
    {
      url: '/api',
    },
  ],
  tags: [
    {
      name: 'Login',
    },
    {
      name: 'Enquete',
    },
  ],
  paths: {
    '/login': loginPath,
    '/signup': signUpPath,
    '/surveys': surveyPath,
    '/surveys/{surveyId}/results': surveyResultPath,
  },
  schemas,
  components: {
    securitySchemes: {
      apiKeyAuthSchema: schemas.apiKeyAuthSchema,
    },
    ...components,
  },
}
