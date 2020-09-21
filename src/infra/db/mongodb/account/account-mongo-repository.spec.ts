import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { AccountMongoRepository } from './account-mongo-repository'
import { Collection } from 'mongodb'
import { AddAccountModel } from '@/domain/usecases/add-account'
import { AccountModel } from '@/domain/models/account'
const makeSut = (): AccountMongoRepository => new AccountMongoRepository()
const makeAddParams = (): AddAccountModel => ({
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password'
})
let accountCollection: Collection
const makeMockAccount = async (withAccessToken?: boolean,withRole?: boolean): Promise<AccountModel> => {
  const newAccount = makeAddParams() as AccountModel
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
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })
  describe('add',() => {
    test('Should return an account on add success',async () => {
      const sut = makeSut()
      const account = await sut.add(makeAddParams())
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
      await makeMockAccount()
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
      const newAccount = await makeMockAccount()
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
      await makeMockAccount(true)
      const account = await sut.loadByToken('any_token')
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('any_name')
      expect(account.email).toBe('any_email@mail.com')
      expect(account.password).toBe('any_password')
    })
    test('Should return an account on loadByToken with role admin role',async () => {
      const sut = makeSut()
      await makeMockAccount(true,true)
      const account = await sut.loadByToken('any_token','any_role')
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('any_name')
      expect(account.email).toBe('any_email@mail.com')
      expect(account.password).toBe('any_password')
    })
    test('Should return null on loadByToken with invalid role',async () => {
      const sut = makeSut()
      await makeMockAccount(true,false)
      const account = await sut.loadByToken('any_token','admin')
      expect(account).toBeFalsy()
    })

    test('Should return an account on loadByToken if user is admin',async () => {
      const sut = makeSut()
      await makeMockAccount(true,true)
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
