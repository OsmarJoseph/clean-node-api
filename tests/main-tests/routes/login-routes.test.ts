import { app } from '@/main/config/app'
import { MongoHelper } from '@/infra/db/mongodb/helpers'
import { getAccountsCollection, AccountsCollection } from '@/infra/db/mongodb/collections'
import request from 'supertest'
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
        .send({
          name: 'Osmar',
          email: 'osmar@email.com',
          password: '123',
          passwordConfirmation: '123'
        })
        .expect(200)
    })
  })

  describe('POST /login',() => {
    test('Should return 200 on login success',async () => {
      const password = await hash('123',12)
      await accountCollection.insertOne({
        name: 'Osmar',
        email: 'osmar@mail.com',
        password
      })
      await request(app).post('/api/login')
        .send({
          email: 'osmar@mail.com',
          password: '123'
        })
        .expect(200)
    })
    test('Should return 401 on login fails',async () => {
      await request(app).post('/api/login')
        .send({
          email: 'osmar@mail.com',
          password: '123'
        })
        .expect(401)
    })
  })
})
