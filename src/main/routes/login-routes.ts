import { Router } from 'express'
import { makeSignUpController } from '../factories/signup/signup-controller-factory'
import { adaptRoute } from '../adapters/express/express-route-adapter'

export default (router: Router): void => {
  router.post('/signup', adaptRoute(makeSignUpController()))
}
