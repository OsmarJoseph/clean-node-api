import { LogErrorRepository } from '@/data/protocols/'

export class LogErrorRepositorySpy implements LogErrorRepository {
  errorStack: string
  async logError ({ errorStack }: LogErrorRepository.Params): Promise<void> {
    this.errorStack = errorStack
  }
}
