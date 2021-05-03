import { noCache } from '@/main/middlewares'
import { docsConfig } from '@/main/docs'
import { serve, setup } from 'swagger-ui-express'
import { Express } from 'express'

export const setupSwagger = (app: Express): void => {
  app.use('/api-docs', serve, noCache, setup(docsConfig))
}
