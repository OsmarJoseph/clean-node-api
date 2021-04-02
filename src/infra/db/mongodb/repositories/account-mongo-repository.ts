import { AddAccountRepository , LoadAccountByEmailRepository , UpdateAccessTokenRepository , LoadAccountIdByTokenRepository, CheckAccountByEmailRepository } from '@/data/protocols'
import { MongoHelper } from '@/infra/db/mongodb/helpers/'
import { getAccountsCollection } from '@/infra/db/mongodb/collections'
export class AccountMongoRepository implements AddAccountRepository,LoadAccountByEmailRepository,UpdateAccessTokenRepository,LoadAccountIdByTokenRepository,CheckAccountByEmailRepository {
  async add (account: AddAccountRepository.Params): Promise<AddAccountRepository.Result> {
    const accountsCollection = await getAccountsCollection()

    const result = await accountsCollection.insertOne(account)
    return !!result.ops[0]
  }

  async loadByEmail (email: string): Promise<LoadAccountByEmailRepository.Result> {
    const accountsCollection = await getAccountsCollection()
    const account = await accountsCollection.findOne({ email })
    return MongoHelper.map(account)
  }

  async checkByEmail (email: string): Promise<CheckAccountByEmailRepository.Result> {
    const accountsCollection = await getAccountsCollection()
    const account = await accountsCollection.findOne({ email },{ projection: { _id: 1 } })
    return !!account
  }

  async updateAccessToken (userId: string,token: string): Promise<void> {
    const accountsCollection = await getAccountsCollection()
    await accountsCollection.updateOne({ _id: userId },{ $set: { accessToken: token } })
  }

  async loadAccountIdByToken (token: string,role?: string): Promise<LoadAccountIdByTokenRepository.Result> {
    const accountsCollection = await getAccountsCollection()
    const accountId = await accountsCollection.findOne(
      {
        accessToken: token,
        $or: [{ role: 'admin' },{ role }]
      },
      { projection: { _id: 1 } }
    )
    return MongoHelper.map(accountId)?.id
  }
}
