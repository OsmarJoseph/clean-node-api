import { makeFakeApolloServer } from './helpers'
import { AccountsCollection, getAccountsCollection } from '@/infra/db/mongodb/collections'
import { MongoHelper } from '@/infra/db/mongodb/helpers'

import { hash } from 'bcrypt'
import { createTestClient } from 'apollo-server-integration-testing'
import { ApolloServer, gql } from 'apollo-server-express'

let accountCollection: AccountsCollection
let apolloServer: ApolloServer
describe('Login GraphQL', () => {
  beforeAll(async () => {
    apolloServer = makeFakeApolloServer()
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = await getAccountsCollection()
    await accountCollection.deleteMany({})
  })
  describe('Login Query', () => {
    const loginQuery = gql`
    query login($email:String!,$password:String!){
      login(email:$email,password:$password) {
        accessToken
      }
    }`

    test('should return an Account on valid credentials', async () => {
      const fakePassword = '123'
      const password = await hash(fakePassword,12)
      const fakeEmail = 'osmarjoseph2013@hotmail.com'
      await accountCollection.insertOne({
        name: 'Osmar',
        email: fakeEmail,
        password
      })
      const { query } = createTestClient({ apolloServer })
      const res: any = await query(loginQuery,{
        variables: { email: fakeEmail, password: fakePassword }
      })
      expect(res.data.login.accessToken).toBeTruthy()
    })
  })
})
