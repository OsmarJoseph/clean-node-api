import { makeLoginValidation } from './login-validation-factory'
import { Controller } from '../../../../presentation/protocols'
import { LoginController } from '../../../../presentation/controllers/login/login-controller'
import { makeDbAuthentication } from '../../usecases/authentication/db-authentication-factory'

export const makeLoginControlller = (): Controller => {
  return new LoginController(makeDbAuthentication(), makeLoginValidation())
}
