import { Router } from 'express'
import { makeSignUpController } from '../factories/controllers/login/signup/signup-controller-factory'
import { adaptRoute } from '../adapters/express/express-route-adapter'
import { makeLoginControlller } from '../factories/controllers/login/login/login-controller-factory'
import { makeLogControllerDecorator } from '../factories/decorators/log-controller-decorator-factory'

export default (router: Router): void => {
  router.post('/signup', adaptRoute(makeLogControllerDecorator(makeSignUpController())))
  router.post('/login', adaptRoute(makeLogControllerDecorator(makeLoginControlller())))
}
