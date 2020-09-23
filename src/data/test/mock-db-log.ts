import { LogModel } from '@/domain/models/log'
import { LogErrorRepository } from '@/data/protocols/db/log/log-error-repository'

export const makeMockLogErrorRepository = (): LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async logError (errorStack: string): Promise<LogModel> {
      return null
    }
  }
  return new LogErrorRepositoryStub()
}
