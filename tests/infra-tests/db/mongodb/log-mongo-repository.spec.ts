import { LogErrorRepository } from '@/data/protocols'
import { LogMongoRepository } from '@/infra/db/mongodb/repositories'
import { MongoHelper } from '@/infra/db/mongodb/helpers'
import { getErrorCollection, ErrorCollection } from '@/infra/db/mongodb/collections'

import faker from 'faker'

const makeSut = (): LogErrorRepository => new LogMongoRepository()
describe('Log Mongo Repository', () => {
  let errorCollection: ErrorCollection
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    errorCollection = await getErrorCollection()
    await errorCollection.deleteMany({})
  })
  test('Should create an error log on success',async () => {
    const sut = makeSut()
    await sut.logError(faker.random.words())
    const count = await errorCollection.countDocuments()
    expect(count).toBe(1)
  })
  test('Should return an error log',async () => {
    const sut = makeSut()
    const errorStack = faker.random.words()
    const logResult = await sut.logError(errorStack)
    expect(logResult).toBeTruthy()
    expect(logResult.id).toBeTruthy()
    expect(logResult.date).toBeTruthy()
    expect(logResult.errorStack).toBe(errorStack)
  })
})
