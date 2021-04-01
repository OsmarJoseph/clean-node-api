import { AccountModel } from '@/domain/models'
import { AddAccountRepository } from '@/data/protocols'
import { env } from '@/main/config/env'
import { MongoHelper } from '@/infra/db/mongodb/helpers'
import { mockAddAccountParams } from '@/tests/domain-tests/mocks'
import { AccountsCollection } from '@/infra/db/mongodb/collections'
import { Optional } from '@/helpers/types'

import { sign } from 'jsonwebtoken'

export const insertMockAccountOnDatabase = async (accountCollection: AccountsCollection,customParams?: Optional<AddAccountRepository.Params>): Promise<AccountModel> => {
  const opResult = await accountCollection.insertOne({ ...mockAddAccountParams(),...customParams })
  return MongoHelper.map(opResult.ops[0])
}

type AddValidAccessToAccountParams = {
  account: AccountModel
  accountCollection: AccountsCollection
  withAdminRole?: boolean
}

export const addValidAccessToAccount = async ({ account,accountCollection,withAdminRole = false }: AddValidAccessToAccountParams): Promise<string> => {
  const accessToken = sign({ id: account.id }, env.jwtSecret)
  if (withAdminRole) {
    await accountCollection.updateOne({ _id: account.id },{ $set: { accessToken,role: 'admin' } })
  } else {
    await accountCollection.updateOne({ _id: account.id },{ $set: { accessToken } })
  }

  return accessToken
}
