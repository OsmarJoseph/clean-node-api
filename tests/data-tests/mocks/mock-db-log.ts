import { LogModel } from '@/domain/models'
import { LogErrorRepository } from '@/data/protocols/'

export class LogErrorRepositorySpy implements LogErrorRepository {
  errorStack: string
  async logError (errorStack: string): Promise<LogModel> {
    this.errorStack = errorStack
    return null
  }
}
