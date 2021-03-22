import { Hasher,AddAccountRepository,LoadAccountByEmailRepository } from '@/data/protocols'
import { AddAccount } from '@/domain/usecases'

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  ) {}

  async add (account: AddAccount.Params): Promise<AddAccount.Result> {
    const { password, email } = account
    const loadedAccount = await this.loadAccountByEmailRepository.loadByEmail(
      email
    )
    if (loadedAccount) {
      return false
    }
    const hashedPassword = await this.hasher.hash(password)
    const isValid = await this.addAccountRepository.add({
      ...account,
      password: hashedPassword
    })
    return !!isValid
  }
}
