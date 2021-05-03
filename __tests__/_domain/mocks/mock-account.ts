import { AccountModel } from '@/domain/models'
import { AddAccount, Authentication } from '@/domain/usecases'
import faker from 'faker'

export const mockAddAccountParams = (): AddAccount.Params => ({
  name: faker.name.findName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
})

export const mockAccountParams = (): AddAccount.Params & { passwordConfirmation: string } => {
  const mockedPassword = faker.internet.password()
  return {
    email: faker.internet.email(),
    name: faker.name.findName(),
    password: mockedPassword,
    passwordConfirmation: mockedPassword,
  }
}

export const mockAccountModel = (): AccountModel => ({
  id: faker.random.uuid(),
  ...mockAddAccountParams(),
})

export const mockAuthenticationParams = (): Authentication.Params => ({
  email: faker.internet.email(),
  password: faker.internet.password(),
})
