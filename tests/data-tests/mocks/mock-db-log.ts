import { LogModel } from '@/domain/models'
import { LogErrorRepository } from '@/data/protocols/'

export const makeMockLogErrorRepository = (): LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async logError (errorStack: string): Promise<LogModel> {
      return null
    }
  }
  return new LogErrorRepositoryStub()
}
