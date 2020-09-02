import { MongoHelper } from '../infra/db/mongodb/helpers/mongo-helper'
import { env } from './config/env'

MongoHelper.connect(env.mongoUrl).then(async () => {
  // ensure that doesnt import any method that depends on databse before the database connection
  const { app } = (await import('./config/app'))

  app.listen(env.port, () => console.log(`Server is running at http://localhost:${env.port}`))
}).catch(console.error)