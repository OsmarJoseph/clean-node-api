import { docsConfig } from '../docs'
import { noCache } from '../middlewares/no-cache/no-cache'
import { serve,setup } from 'swagger-ui-express'
import { Express } from 'express'

export const setupSwagger = (app: Express): void => {
  app.use('/api-docs', serve,noCache, setup(docsConfig))
}
