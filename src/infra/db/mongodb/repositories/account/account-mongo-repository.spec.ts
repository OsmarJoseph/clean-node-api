import { AccountMongoRepository } from './account-mongo-repository'
import { AccountModel } from '@/domain/models/account'
import { makeMockAddAccountParams } from '@/domain/test'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { getAccountsCollection, AccountsCollection } from '@/infra/db/mongodb/collections'
const makeSut = (): AccountMongoRepository => new AccountMongoRepository()

let accountCollection: AccountsCollection
const insertMockAccountOnDatabase = async (withAccessToken?: boolean,withRole?: boolean): Promise<AccountModel> => {
  const newAccount = makeMockAddAccountParams() as AccountModel
  if (withAccessToken) {
    newAccount.accessToken = 'any_token'
  }
  if (withRole) {
    newAccount.role = 'admin'
  }
  const opResult = await accountCollection.insertOne(newAccount)
  return MongoHelper.map(opResult.ops[0])
}
describe('Account Mongo Repository',() => {
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
      const account = await sut.add(makeMockAddAccountParams())
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('any_name')
      expect(account.email).toBe('any_email@mail.com')
      expect(account.password).toBe('any_password')
    })
  })
  describe('loadByEmail',() => {
    test('Should return an account on loadByEmail success',async () => {
      const sut = makeSut()
      await insertMockAccountOnDatabase()
      const account = await sut.loadByEmail('any_email@mail.com')
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('any_name')
      expect(account.email).toBe('any_email@mail.com')
      expect(account.password).toBe('any_password')
    })

    test('Should return null if loadByEmail fails',async () => {
      const sut = makeSut()
      const account = await sut.loadByEmail('any_email@mail.com')
      expect(account).toBeFalsy()
    })
  })
  describe('updateAccessToken',() => {
    test('Should update the account accessToken on updateAccessToken success',async () => {
      const sut = makeSut()
      const newAccount = await insertMockAccountOnDatabase()
      expect(newAccount.accessToken).toBeFalsy()
      await sut.updateAccessToken(newAccount.id,'any_token')
      const usedAccount = await accountCollection.findOne({ _id: newAccount.id })
      expect(usedAccount).toBeTruthy()
      expect(usedAccount.accessToken).toBe('any_token')
    })
  })
  describe('loadByToken',() => {
    test('Should return an account on loadByToken without role',async () => {
      const sut = makeSut()
      await insertMockAccountOnDatabase(true)
      const account = await sut.loadByToken('any_token')
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('any_name')
      expect(account.email).toBe('any_email@mail.com')
      expect(account.password).toBe('any_password')
    })
    test('Should return an account on loadByToken with role admin role',async () => {
      const sut = makeSut()
      await insertMockAccountOnDatabase(true,true)
      const account = await sut.loadByToken('any_token','any_role')
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('any_name')
      expect(account.email).toBe('any_email@mail.com')
      expect(account.password).toBe('any_password')
    })
    test('Should return null on loadByToken with invalid role',async () => {
      const sut = makeSut()
      await insertMockAccountOnDatabase(true,false)
      const account = await sut.loadByToken('any_token','admin')
      expect(account).toBeFalsy()
    })

    test('Should return an account on loadByToken if user is admin',async () => {
      const sut = makeSut()
      await insertMockAccountOnDatabase(true,true)
      const account = await sut.loadByToken('any_token')
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('any_name')
      expect(account.email).toBe('any_email@mail.com')
      expect(account.password).toBe('any_password')
    })
    test('Should return null if loadByToken fails',async () => {
      const sut = makeSut()
      const account = await sut.loadByToken('any_token')
      expect(account).toBeFalsy()
    })
  })
})
