import { LoadAccountIdByToken } from '@/domain/usecases'

export interface LoadAccountIdByTokenRepository {
  loadAccountIdByToken: (
    token: string,
    role?: string,
  ) => Promise<LoadAccountIdByTokenRepository.Result>
}

export namespace LoadAccountIdByTokenRepository {
  export type Result = LoadAccountIdByToken.Result
}
