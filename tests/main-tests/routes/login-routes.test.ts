import { app } from '@/main/config/app'
import { MongoHelper } from '@/infra/db/mongodb/helpers'
import { getAccountsCollection, AccountsCollection } from '@/infra/db/mongodb/collections'
import request from 'supertest'
import { insertMockAccountOnDatabase } from '@/tests/infra-tests/mocks'
import { mockAccountParams } from '@/tests/domain-tests/mocks'

import faker from 'faker'
import { hash } from 'bcrypt'

let accountCollection: AccountsCollection
describe('Login Routes',() => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = await getAccountsCollection()
    await accountCollection.deleteMany({})
  })
  describe('POST /signup',() => {
    test('Should return 200 on signup success',async () => {
      await request(app).post('/api/signup')
        .send(mockAccountParams())
        .expect(200)
    })
  })

  describe('POST /login',() => {
    test('Should return 200 on login success',async () => {
      const mockPassword = faker.internet.password()
      const hashedPassword = await hash(mockPassword,12)
      const { email } = await insertMockAccountOnDatabase(accountCollection, { password: hashedPassword })

      await request(app).post('/api/login')
        .send({
          email,
          password: mockPassword
        })
        .expect(200)
    })
    test('Should return 401 on login fails',async () => {
      await request(app).post('/api/login')
        .send({
          email: faker.internet.email(),
          password: faker.internet.password()
        })
        .expect(401)
    })
  })
})
