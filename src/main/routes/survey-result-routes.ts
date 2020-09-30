import { makeSaveSurveyResultController } from '@/main/factories/controllers/survey-result/save-survey-result/save-survey-result-controller-factory'
import { makeLoadSurveyResultController } from '@/main/factories/controllers/survey-result/load-survey-result/load-survey-result-controller-factory'
import { normalAuth } from '@/main/middlewares'
import { adaptRoute } from '@/main/adapters/express/express-route-adapter'
import { Router } from 'express'

export default (router: Router): void => {
  router.put('/surveys/:surveyId/results',normalAuth, adaptRoute(makeSaveSurveyResultController()))
  router.get('/surveys/:surveyId/results',normalAuth, adaptRoute(makeLoadSurveyResultController()))
}
