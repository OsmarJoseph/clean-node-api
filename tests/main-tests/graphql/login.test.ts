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
    test('should return UnauthorizedError on invalid credentials', async () => {
      const { query } = createTestClient({ apolloServer })
      const res: any = await query(loginQuery,{
        variables: { email: 'osmarjoseph2013@hotmail.com', password: '123' }
      })
      expect(res.data).toBeFalsy()
      expect(res.errors[0].message).toBe('Unauthorized access')
    })
  })
  describe('signUp Mutation', () => {
    const signUpMutation = gql`
    mutation signUp($name:String!,$email:String!,$password:String!,$passwordConfirmation:String!){
      signUp(name:$name,email:$email,password:$password,passwordConfirmation:$passwordConfirmation) {
        accessToken
      }
    }`

    test('should create an Account on valid data', async () => {
      const { mutate } = createTestClient({ apolloServer })
      const res: any = await mutate(signUpMutation,{
        variables: {
          name: 'Osmar',
          email: 'osmarjoseph2013@hotmail.com',
          password: '123',
          passwordConfirmation: '123'
        }
      })
      expect(res.data.signUp.accessToken).toBeTruthy()
    })
    test('should return EmailInUseError on email in use', async () => {
      const usedEmail = 'osmarjoseph2013@hotmail.com'
      await accountCollection.insertOne({
        name: 'Osmar',
        email: usedEmail,
        password: '1234'
      })
      const { mutate } = createTestClient({ apolloServer })
      const res: any = await mutate(signUpMutation,{
        variables: {
          name: 'Osmar Joseph',
          email: usedEmail,
          password: '123',
          passwordConfirmation: '123'
        }
      })
      expect(res.data).toBeFalsy()
      expect(res.errors[0].message).toBe('The received email is already in use')
    })
  })
})
