import { AccountModel } from '@/domain/models'

export interface LoadAccountByToken{
  loadByToken(accessToken: string,role?: string): Promise<AccountModel>
}
