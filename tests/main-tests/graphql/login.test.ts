import { makeFakeApolloServer } from './helpers'
import { AccountsCollection, getAccountsCollection } from '@/infra/db/mongodb/collections'
import { MongoHelper } from '@/infra/db/mongodb/helpers'
import { insertMockAccountOnDatabase } from '@/tests/infra-tests/mocks'
import { mockAccountParams } from '@/tests/domain-tests/mocks'

import { hash } from 'bcrypt'
import { createTestClient } from 'apollo-server-integration-testing'
import { ApolloServer, gql } from 'apollo-server-express'
import faker from 'faker'

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
      const mockPassword = faker.internet.password()
      const hashedPassword = await hash(mockPassword,12)
      const { email } = await insertMockAccountOnDatabase(accountCollection, { password: hashedPassword })

      const { query } = createTestClient({ apolloServer })
      const res: any = await query(loginQuery,{
        variables: { email: email, password: mockPassword }
      })
      expect(res.data.login.accessToken).toBeTruthy()
    })
    test('should return UnauthorizedError on invalid credentials', async () => {
      const { query } = createTestClient({ apolloServer })
      const res: any = await query(loginQuery,{
        variables: { email: faker.internet.email(), password: faker.internet.password() }
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
          ...mockAccountParams()
        }
      })
      expect(res.data.signUp.accessToken).toBeTruthy()
    })
    test('should return EmailInUseError on email in use', async () => {
      const usedEmail = faker.internet.email()
      await insertMockAccountOnDatabase(accountCollection, { email: usedEmail })

      const { mutate } = createTestClient({ apolloServer })
      const res: any = await mutate(signUpMutation,{
        variables: {
          ...mockAccountParams(),
          email: usedEmail
        }
      })
      expect(res.data).toBeFalsy()
      expect(res.errors[0].message).toBe('The received email is already in use')
    })
  })
})
