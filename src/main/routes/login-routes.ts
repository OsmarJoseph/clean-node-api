import { Router } from 'express'
import { makeSignUpController , makeLoginControlller } from '@/main/factories/'
import { adaptRoute } from '@/main/adapters'

export default (router: Router): void => {
  router.post('/signup', adaptRoute(makeSignUpController()))
  router.post('/login', adaptRoute(makeLoginControlller()))
}
