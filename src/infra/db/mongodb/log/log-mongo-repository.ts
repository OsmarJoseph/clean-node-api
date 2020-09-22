import { LogModel } from '@/domain/models/log'
import { LogErrorRepository } from '@/data/protocols/db/log/log-error-repository'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { getErrorCollection } from '@/infra/db/mongodb/collections'

export class LogMongoRepository implements LogErrorRepository {
  async logError (errorStack: string): Promise<LogModel> {
    const errorCollection = await getErrorCollection()
    const result = await errorCollection.insertOne({
      errorStack,
      date: new Date()
    })
    return MongoHelper.map(result.ops[0])
  }
}
