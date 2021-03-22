import { AccountModel } from '@/domain/models'
import { AddAccountRepository , LoadAccountByEmailRepository , UpdateAccessTokenRepository , LoadAccountIdByTokenRepository } from '@/data/protocols'
import { MongoHelper } from '@/infra/db/mongodb/helpers/'
import { getAccountsCollection } from '@/infra/db/mongodb/collections'
export class AccountMongoRepository implements AddAccountRepository,LoadAccountByEmailRepository,UpdateAccessTokenRepository,LoadAccountIdByTokenRepository {
  async add (account: AddAccountRepository.Params): Promise<AddAccountRepository.Result> {
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

  async loadAccountIdByToken (token: string,role?: string): Promise<LoadAccountIdByTokenRepository.Result> {
    const accountCollection = await getAccountsCollection()
    const accountId = await accountCollection.findOne(
      {
        accessToken: token,
        $or: [{ role: 'admin' },{ role }]
      },
      { projection: { _id: 1 } }
    )
    return MongoHelper.map(accountId)?.id
  }
}
