import { LogErrorRepository } from '@/data/protocols'
import { LogMongoRepository } from '@/infra/db/mongodb/repositories'
import { MongoHelper } from '@/infra/db/mongodb/helpers'
import { getErrorsCollection, ErrorsCollection } from '@/infra/db/mongodb/collections'

import faker from 'faker'

const makeSut = (): LogErrorRepository => new LogMongoRepository()
describe('Log Mongo Repository', () => {
  let errorsCollection: ErrorsCollection
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    errorsCollection = await getErrorsCollection()
    await errorsCollection.deleteMany({})
  })
  test('Should create an error log on success',async () => {
    const sut = makeSut()
    await sut.logError({ errorStack: faker.random.words() })
    const count = await errorsCollection.countDocuments()
    expect(count).toBe(1)
  })
  test('Should return an error log',async () => {
    const sut = makeSut()
    const errorStack = faker.random.words()
    await sut.logError({ errorStack })
    const savedLog = MongoHelper.map(await errorsCollection.findOne({}))
    expect(savedLog).toBeTruthy()
    expect(savedLog.id).toBeTruthy()
    expect(savedLog.errorStack).toBeTruthy()
    expect(savedLog.date).toBeTruthy()
  })
})
