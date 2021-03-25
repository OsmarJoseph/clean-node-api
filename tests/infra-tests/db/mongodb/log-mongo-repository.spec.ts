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
    await sut.logError({ errorStack: faker.random.words() })
    const count = await errorCollection.countDocuments()
    expect(count).toBe(1)
  })
  test('Should return an error log',async () => {
    const sut = makeSut()
    const errorStack = faker.random.words()
    await sut.logError({ errorStack })
    const savedLog = await errorCollection.findOne({})
    expect(savedLog).toBeTruthy()
    expect(savedLog._id).toBeTruthy()
    expect(savedLog.errorStack).toBeTruthy()
    expect(savedLog.date).toBeTruthy()
  })
})
