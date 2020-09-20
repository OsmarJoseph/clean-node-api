import { Router } from 'express'
import { makeAddSurveyController } from '../factories/controllers/survey/add-survey/add-survey-controller-factory'
import { adaptRoute } from '../adapters/express/express-route-adapter'
import { makeLogControllerDecorator } from '../factories/decorators/log-controller-decorator-factory'
import { makeLoadSurveysController } from '../factories/controllers/survey/load-surveys/load-surveys-controller-factory'
import { adminAuth } from '../middlewares/admin-auth'
import { normalAuth } from '../middlewares/normal-auth'

export default (router: Router): void => {
  router.post('/surveys',adminAuth, adaptRoute(makeLogControllerDecorator(makeAddSurveyController())))
  router.get('/surveys',normalAuth, adaptRoute(makeLogControllerDecorator(makeLoadSurveysController())))
}
