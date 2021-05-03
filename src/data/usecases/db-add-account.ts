import { Hasher, AddAccountRepository, CheckAccountByEmailRepository } from '@/data/protocols'
import { AddAccount } from '@/domain/usecases'

export class DbAddAccount implements AddAccount {
  constructor(
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly checkAccountByEmailRepository: CheckAccountByEmailRepository,
  ) {}

  async add(account: AddAccount.Params): Promise<AddAccount.Result> {
    const { password, email } = account
    const existsAccount = await this.checkAccountByEmailRepository.checkByEmail(email)
    if (existsAccount) {
      return false
    }
    const hashedPassword = await this.hasher.hash(password)
    const isValid = await this.addAccountRepository.add({
      ...account,
      password: hashedPassword,
    })
    return !!isValid
  }
}
