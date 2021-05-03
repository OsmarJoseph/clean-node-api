import { SignUpController } from '@/presentation/controllers/'
import { Controller } from '@/presentation/protocols'
import { makeSignUpValidation } from './signup-validation-factory'
import {
  makeDbAuthentication,
  makeDbAddAccount,
  makeLogControllerDecorator,
} from '@/main/factories'

export const makeSignUpController = (): Controller => {
  const signUpController = new SignUpController(
    makeDbAddAccount(),
    makeSignUpValidation(),
    makeDbAuthentication(),
  )
  return makeLogControllerDecorator(signUpController)
}
