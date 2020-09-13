import { LogModel } from '../../../../domain/models/log'

export interface LogErrorRepository{
  logError (errorStack: string): Promise<LogModel>
}
