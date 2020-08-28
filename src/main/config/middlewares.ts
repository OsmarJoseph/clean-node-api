import { Express } from 'express'
import { bodyParser } from './middlewares/body-parser/body-parser'
import { cors } from './middlewares/cors/cors'
export function setupMiddlewares (app: Express): void {
  app.use(bodyParser)
  app.use(cors)
}
