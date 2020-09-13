import { AddAccount, Hasher,AddAccountModel,AccountModel,AddAccountRepository } from './db-add-account-protocols'
export class DbAddAccount implements AddAccount {
  constructor (
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository) {}

  async add (account: AddAccountModel): Promise<AccountModel> {
    const { password } = account
    const hashedPassword = await this.hasher.hash(password)
    const accountModelSaved = await this.addAccountRepository.add(
      { ...account,password: hashedPassword }
    )
    return accountModelSaved
  }
}
