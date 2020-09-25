import { Router } from 'express'
import { makeAddSurveyController } from '@/main/factories/controllers/survey/add-survey/add-survey-controller-factory'
import { adaptRoute } from '@/main/adapters/express/express-route-adapter'
import { makeLoadSurveysController } from '@/main/factories/controllers/survey/load-surveys/load-surveys-controller-factory'
import { adminAuth , normalAuth } from '@/main/middlewares'

export default (router: Router): void => {
  router.post('/surveys',adminAuth, adaptRoute(makeAddSurveyController()))
  router.get('/surveys',normalAuth, adaptRoute(makeLoadSurveysController()))
}
