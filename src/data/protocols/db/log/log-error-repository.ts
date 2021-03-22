import { LogModel } from '@/domain/models'

export interface LogErrorRepository{
  logError: (errorStack: string) => Promise<LogModel>
}
