import { AddAccount, Hasher,AddAccountModel,AccountModel,AddAccountRepository, LoadAccountByEmailRepository } from './db-add-account-protocols'
export class DbAddAccount implements AddAccount {
  constructor (
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  ) {}

  async add (account: AddAccountModel): Promise<AccountModel> {
    const { password,email } = account
    await this.loadAccountByEmailRepository.loadByEmail(email)
    const hashedPassword = await this.hasher.hash(password)
    const accountModelSaved = await this.addAccountRepository.add(
      { ...account,password: hashedPassword }
    )
    return accountModelSaved
  }
}
