import { AccountModel } from '@/domain/models'
import { AddAccountParams , AuthenticationParams } from '@/domain/usecases'

export const makeMockAddAccountParams = (): AddAccountParams => ({
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password'
})
export const makeMockAccountModel = (): AccountModel => ({
  id: 'any_id',
  ...makeMockAddAccountParams()
})

export const makeMockAuthenticationParams = (): AuthenticationParams => ({
  email: 'any_email@mail.com',
  password: 'any_password'
})
