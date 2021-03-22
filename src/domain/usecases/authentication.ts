export interface Authentication {
  auth: (authenticationParams: Authentication.Params) => Promise<string>
}

export namespace Authentication {
  export type Params = {
    email: string
    password: string
  }
  export type Result = string
}
