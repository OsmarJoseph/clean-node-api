import { MongoHelper } from '../helpers/mongo-helper'
import { LogErrorRepository } from '../../../../data/protocols/db/log/log-error-repository'
import { LogModel } from '../../../../domain/models/log'

export class LogMongoRepository implements LogErrorRepository {
  async logError (errorStack: string): Promise<LogModel> {
    const errorCollection = await MongoHelper.getCollection('errors')
    const result = await errorCollection.insertOne({
      errorStack,
      date: new Date()
    })
    return MongoHelper.map(result.ops[0])
  }
}
