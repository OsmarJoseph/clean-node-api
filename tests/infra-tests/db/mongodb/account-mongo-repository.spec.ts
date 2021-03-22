import { AddAccountRepository } from '@/data/protocols'
import { mockAddAccountParams } from '@/tests/domain-tests/mocks'
import { AccountMongoRepository } from '@/infra/db/mongodb/repositories'
import { MongoHelper } from '@/infra/db/mongodb/helpers'
import { getAccountsCollection, AccountsCollection } from '@/infra/db/mongodb/collections'

import faker from 'faker'

const makeSut = (): AccountMongoRepository => new AccountMongoRepository()

let accountCollection: AccountsCollection
const insertMockAccountOnDatabase = async (newAccount: AddAccountRepository.Params): Promise<AddAccountRepository.Result> => {
  const opResult = await accountCollection.insertOne(newAccount)
  return MongoHelper.map(opResult.ops[0])
}
describe('Account Mongo Repository',() => {
  let accessToken = faker.random.uuid()
  let role = 'admin'
  let addAccountParams = mockAddAccountParams()

  beforeEach(() => {
    accessToken = faker.random.uuid()
    role = 'admin'
    addAccountParams = mockAddAccountParams()
  })

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
  describe('add',() => {
    test('Should return an account on add success',async () => {
      const sut = makeSut()
      const addAccountParams = mockAddAccountParams()
      const account = await sut.add(addAccountParams)
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe(addAccountParams.name)
      expect(account.email).toBe(addAccountParams.email)
      expect(account.password).toBe(addAccountParams.password)
    })
  })
  describe('loadByEmail',() => {
    test('Should return an account on loadByEmail success',async () => {
      const sut = makeSut()
      const addAccountParams = mockAddAccountParams()
      await insertMockAccountOnDatabase(addAccountParams)
      const account = await sut.loadByEmail(addAccountParams.email)
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe(addAccountParams.name)
      expect(account.email).toBe(addAccountParams.email)
      expect(account.password).toBe(addAccountParams.password)
    })

    test('Should return null if loadByEmail fails',async () => {
      const sut = makeSut()
      const account = await sut.loadByEmail(faker.internet.email())
      expect(account).toBeFalsy()
    })
  })
  describe('updateAccessToken',() => {
    test('Should update the account accessToken on updateAccessToken success',async () => {
      const sut = makeSut()
      const newAccount = await insertMockAccountOnDatabase(addAccountParams)
      expect(newAccount.accessToken).toBeFalsy()
      const newAccessToken = faker.random.uuid()
      await sut.updateAccessToken(newAccount.id,newAccessToken)
      const usedAccount = await accountCollection.findOne({ _id: newAccount.id })
      expect(usedAccount).toBeTruthy()
      expect(usedAccount.accessToken).toBe(newAccessToken)
    })
  })
  describe('loadByToken',() => {
    test('Should return an account on loadByToken without role',async () => {
      const sut = makeSut()
      addAccountParams.accessToken = accessToken
      await insertMockAccountOnDatabase(addAccountParams)
      const account = await sut.loadByToken(accessToken)
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe(addAccountParams.name)
      expect(account.email).toBe(addAccountParams.email)
      expect(account.password).toBe(addAccountParams.password)
    })
    test('Should return an account on loadByToken with role admin role',async () => {
      const sut = makeSut()
      addAccountParams.accessToken = accessToken
      addAccountParams.role = role
      await insertMockAccountOnDatabase(addAccountParams)
      const account = await sut.loadByToken(accessToken,role)
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe(addAccountParams.name)
      expect(account.email).toBe(addAccountParams.email)
      expect(account.password).toBe(addAccountParams.password)
    })
    test('Should return null on loadByToken with invalid role',async () => {
      const sut = makeSut()
      addAccountParams.accessToken = accessToken
      await insertMockAccountOnDatabase(addAccountParams)
      const account = await sut.loadByToken(accessToken,role)
      expect(account).toBeFalsy()
    })

    test('Should return an account on loadByToken if user is admin',async () => {
      const sut = makeSut()
      addAccountParams.accessToken = accessToken
      addAccountParams.role = role
      await insertMockAccountOnDatabase(addAccountParams)
      const account = await sut.loadByToken(accessToken)
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe(addAccountParams.name)
      expect(account.email).toBe(addAccountParams.email)
      expect(account.password).toBe(addAccountParams.password)
    })
    test('Should return null if loadByToken fails',async () => {
      const sut = makeSut()
      const account = await sut.loadByToken(accessToken)
      expect(account).toBeFalsy()
    })
  })
})
