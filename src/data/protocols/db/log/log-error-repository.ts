export interface LogErrorRepository {
  logError: (logErrorParams: LogErrorRepository.Params) => Promise<void>
}

export namespace LogErrorRepository {
  export type Params = {
    errorStack: string
  }
}
