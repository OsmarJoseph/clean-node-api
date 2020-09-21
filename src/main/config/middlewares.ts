import { Express } from 'express'
import { bodyParser , cors , contentType } from '@/main/middlewares'

export function setupMiddlewares (app: Express): void {
  app.use(bodyParser)
  app.use(cors)
  app.use(contentType)
}
