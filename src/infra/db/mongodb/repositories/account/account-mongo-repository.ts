import { AddAccountRepository } from '@/data/protocols/db/account/add-account-repository'
import { AccountModel } from '@/domain/models/account'
import { AddAccountModel } from '@/domain/usecases/account/add-account'
import { LoadAccountByEmailRepository } from '@/data/protocols/db/account/load-account-by-email-repository'
import { UpdateAccessTokenRepository } from '@/data/protocols/db/account/update-access-token-repository'
import { LoadAccountByTokenRepository } from '@/data/protocols/db/account/load-account-by-token-repository'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { getAccountsCollection } from '@/infra/db/mongodb/collections'
export class AccountMongoRepository implements AddAccountRepository,LoadAccountByEmailRepository,UpdateAccessTokenRepository,LoadAccountByTokenRepository {
  async add (account: AddAccountModel): Promise<AccountModel> {
    const accountCollection = await getAccountsCollection()

    const result = await accountCollection.insertOne(account)
    return MongoHelper.map(result.ops[0])
  }

  async loadByEmail (email: string): Promise<AccountModel> {
    const accountCollection = await getAccountsCollection()
    const account = await accountCollection.findOne({ email })
    return MongoHelper.map(account)
  }

  async updateAccessToken (userId: string,token: string): Promise<void> {
    const accountCollection = await getAccountsCollection()
    await accountCollection.updateOne({ _id: userId },{ $set: { accessToken: token } })
  }

  async loadByToken (token: string,role?: string): Promise<AccountModel> {
    const accountCollection = await getAccountsCollection()
    const account = await accountCollection.findOne({ accessToken: token, $or: [{ role: 'admin' },{ role }] })

    return MongoHelper.map(account)
  }
}
