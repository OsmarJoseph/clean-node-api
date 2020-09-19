import { Router } from 'express'
import { makeAddSurveyController } from '../factories/controllers/survey/add-survey/add-survey-controller-factory'
import { adaptRoute } from '../adapters/express/express-route-adapter'
import { makeLogControllerDecorator } from '../factories/decorators/log-controller-decorator-factory'
import { makeAuthMiddleware } from '../factories/middlewares/auth-middleware-factory'
import { adaptMiddleware } from '../adapters/express/express-middleware-adapter'

export default (router: Router): void => {
  const adminAuth = adaptMiddleware(makeAuthMiddleware('admin'))
  router.post('/surveys',adminAuth, adaptRoute(makeLogControllerDecorator(makeAddSurveyController())))
}
