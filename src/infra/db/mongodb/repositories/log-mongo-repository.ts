import { LogErrorRepository } from '@/data/protocols'
import { MongoHelper } from '@/infra/db/mongodb/helpers/'
import { getErrorsCollection } from '@/infra/db/mongodb/collections'

export class LogMongoRepository implements LogErrorRepository {
  async logError ({ errorStack }: LogErrorRepository.Params): Promise<void> {
    const errorsCollection = await getErrorsCollection()
    const result = await errorsCollection.insertOne({
      errorStack,
      date: new Date()
    })
    return MongoHelper.map(result.ops[0])
  }
}
