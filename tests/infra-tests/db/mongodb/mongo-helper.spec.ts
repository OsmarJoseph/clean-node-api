import { MongoHelper as sut, MongoHelper } from '@/infra/db/mongodb/helpers'

describe('Mongo Helper', () => {
  beforeAll(async () => {
    await sut.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await sut.disconnect()
  })

  test('Should reconnect if mongodb is down', async () => {
    let accountCollection = await sut.getCollection('accounts')
    expect(accountCollection).toBeTruthy()
    await MongoHelper.disconnect()
    accountCollection = await sut.getCollection('accounts')
    expect(accountCollection).toBeTruthy()
  })
})