import { Router } from 'express'
import { makeSignUpController } from '@/main/factories/controllers/login/signup/signup-controller-factory'
import { adaptRoute } from '@/main/adapters/express/express-route-adapter'
import { makeLoginControlller } from '@/main/factories/controllers/login/login/login-controller-factory'
import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory'

export default (router: Router): void => {
  router.post('/signup', adaptRoute(makeLogControllerDecorator(makeSignUpController())))
  router.post('/login', adaptRoute(makeLogControllerDecorator(makeLoginControlller())))
}
