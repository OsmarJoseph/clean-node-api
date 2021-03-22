export interface LoadAccountIdByToken {
  loadAccountIdByToken: (accessToken: string,role?: string) => Promise<LoadAccountIdByToken.Result>
}

export namespace LoadAccountIdByToken {
  export type Result = string
}
