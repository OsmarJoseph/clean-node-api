import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account'
import { Collection } from 'mongodb'
import { AddAccountModel } from '../../../../domain/usecases/add-account'
const makeSut = (): AccountMongoRepository => new AccountMongoRepository()
const makeAddParams = (): AddAccountModel => ({
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password'
})
let accountCollection: Collection
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
  test('Should return an account on add success',async () => {
    const sut = makeSut()
    const account = await sut.add(makeAddParams())
    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('any_name')
    expect(account.email).toBe('any_email@mail.com')
    expect(account.password).toBe('any_password')
  })

  test('Should return an account on loadByEmail success',async () => {
    const sut = makeSut()
    await accountCollection.insertOne(makeAddParams())
    const account = await sut.loadByEmail('any_email@mail.com')
    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('any_name')
    expect(account.email).toBe('any_email@mail.com')
    expect(account.password).toBe('any_password')
  })
})
