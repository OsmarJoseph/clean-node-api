import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { LogErrorRepository } from '@/data/protocols/db/log/log-error-repository'
import { Collection } from 'mongodb'
import { LogMongoRepository } from './log-mongo-repository'

const makeSut = (): LogErrorRepository => new LogMongoRepository()
describe('Log Mongo Repository', () => {
  let errorCollection: Collection
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    errorCollection = await MongoHelper.getCollection('errors')
    await errorCollection.deleteMany({})
  })
  test('Should create an error log on success',async () => {
    const sut = makeSut()
    await sut.logError('any_error')
    const count = await errorCollection.countDocuments()
    expect(count).toBe(1)
  })
  test('Should return an error log',async () => {
    const sut = makeSut()
    const logResult = await sut.logError('any_error')
    expect(logResult).toBeTruthy()
    expect(logResult.id).toBeTruthy()
    expect(logResult.date).toBeTruthy()
    expect(logResult.errorStack).toBe('any_error')
  })
})
