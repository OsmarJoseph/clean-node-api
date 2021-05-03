import { mockAddAccountParams } from '@/tests/_domain/mocks'
import { AccountMongoRepository } from '@/infra/db/mongodb/repositories'
import { MongoHelper } from '@/infra/db/mongodb/helpers'
import { getAccountsCollection, AccountsCollection } from '@/infra/db/mongodb/collections'
import { insertMockAccountOnDatabase } from '@/tests/_infra/mocks'

import faker from 'faker'

const makeSut = (): AccountMongoRepository => new AccountMongoRepository()

let accountsCollection: AccountsCollection

describe('Account Mongo Repository', () => {
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
    accountsCollection = await getAccountsCollection()
    await accountsCollection.deleteMany({})
  })
  describe('add', () => {
    test('Should return true on add success', async () => {
      const sut = makeSut()
      const addAccountParams = mockAddAccountParams()
      const isValid = await sut.add(addAccountParams)
      expect(isValid).toBe(true)
    })
  })
  describe('loadByEmail', () => {
    test('Should return an account on loadByEmail success', async () => {
      const sut = makeSut()
      const addAccountParams = mockAddAccountParams()
      await insertMockAccountOnDatabase(accountsCollection, addAccountParams)
      const account = await sut.loadByEmail(addAccountParams.email)
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe(addAccountParams.name)
      expect(account.email).toBe(addAccountParams.email)
      expect(account.password).toBe(addAccountParams.password)
    })

    test('Should return null if loadByEmail fails', async () => {
      const sut = makeSut()
      const account = await sut.loadByEmail(faker.internet.email())
      expect(account).toBeFalsy()
    })
  })
  describe('checkByEmail', () => {
    test('Should return true if email is valid', async () => {
      const sut = makeSut()
      const addAccountParams = mockAddAccountParams()
      await insertMockAccountOnDatabase(accountsCollection, addAccountParams)
      const existsAccount = await sut.checkByEmail(addAccountParams.email)
      expect(existsAccount).toBe(true)
    })

    test('Should return false if email is not valid', async () => {
      const sut = makeSut()
      const account = await sut.checkByEmail(faker.internet.email())
      expect(account).toBe(false)
    })
  })
  describe('updateAccessToken', () => {
    test('Should update the account accessToken on updateAccessToken success', async () => {
      const sut = makeSut()
      const newAccount = await insertMockAccountOnDatabase(accountsCollection)
      expect(newAccount.accessToken).toBeFalsy()
      const newAccessToken = faker.random.uuid()
      await sut.updateAccessToken(newAccount.id, newAccessToken)
      const usedAccount = await accountsCollection.findOne({ _id: newAccount.id })
      expect(usedAccount).toBeTruthy()
      expect(usedAccount.accessToken).toBe(newAccessToken)
    })
  })
  describe('loadAccountIdByToken', () => {
    test('Should return an account on loadAccountIdByToken without role', async () => {
      const sut = makeSut()
      addAccountParams.accessToken = accessToken
      await insertMockAccountOnDatabase(accountsCollection, addAccountParams)
      const accountId = await sut.loadAccountIdByToken(accessToken)
      expect(accountId).toBeTruthy()
    })
    test('Should return an account on loadAccountIdByToken with role admin role', async () => {
      const sut = makeSut()
      addAccountParams.accessToken = accessToken
      addAccountParams.role = role
      await insertMockAccountOnDatabase(accountsCollection, addAccountParams)
      const accountId = await sut.loadAccountIdByToken(accessToken, role)
      expect(accountId).toBeTruthy()
    })
    test('Should return null on loadAccountIdByToken with invalid role', async () => {
      const sut = makeSut()
      addAccountParams.accessToken = accessToken
      await insertMockAccountOnDatabase(accountsCollection)
      const account = await sut.loadAccountIdByToken(accessToken, role)
      expect(account).toBeFalsy()
    })

    test('Should return an account on loadAccountIdByToken if user is admin', async () => {
      const sut = makeSut()
      addAccountParams.accessToken = accessToken
      addAccountParams.role = role
      await insertMockAccountOnDatabase(accountsCollection, addAccountParams)
      const accountId = await sut.loadAccountIdByToken(accessToken)
      expect(accountId).toBeTruthy()
    })
    test('Should return null if loadAccountIdByToken fails', async () => {
      const sut = makeSut()
      const account = await sut.loadAccountIdByToken(accessToken)
      expect(account).toBeFalsy()
    })
  })
})
