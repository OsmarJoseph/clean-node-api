import { LogErrorRepository } from '@/data/protocols'
import { LogMongoRepository } from '@/infra/db/mongodb/repositories'
import { MongoHelper } from '@/infra/db/mongodb/helpers'
import { getErrorCollection, ErrorCollection } from '@/infra/db/mongodb/collections'

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
