import { AddAccount, Hasher,AddAccountParams,AccountModel,AddAccountRepository, LoadAccountByEmailRepository } from './db-add-account-protocols'
export class DbAddAccount implements AddAccount {
  constructor (
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  ) {}

  async add (account: AddAccountParams): Promise<AccountModel> {
    const { password,email } = account
    const loadedAccount = await this.loadAccountByEmailRepository.loadByEmail(email)
    if (loadedAccount) {
      return null
    }
    const hashedPassword = await this.hasher.hash(password)
    const accountSaved = await this.addAccountRepository.add(
      { ...account,password: hashedPassword }
    )
    return accountSaved
  }
}
