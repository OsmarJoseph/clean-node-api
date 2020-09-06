export interface AuthenticationModel {
  email: string
  password: string
}

export interface Authentication {
  auth(authenticationParams: AuthenticationModel): Promise<string>
}
