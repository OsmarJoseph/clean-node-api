import { LogErrorRepository } from '@/data/protocols'
import { MongoHelper } from '@/infra/db/mongodb/helpers/'
import { getErrorCollection } from '@/infra/db/mongodb/collections'

export class LogMongoRepository implements LogErrorRepository {
  async logError ({ errorStack }: LogErrorRepository.Params): Promise<void> {
    const errorCollection = await getErrorCollection()
    const result = await errorCollection.insertOne({
      errorStack,
      date: new Date()
    })
    return MongoHelper.map(result.ops[0])
  }
}
