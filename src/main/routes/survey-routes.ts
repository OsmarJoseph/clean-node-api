import { Router } from 'express'
import { makeAddSurveyController, makeLoadSurveysController } from '@/main/factories'
import { adaptRoute } from '@/main/adapters'
import { adminAuth, normalAuth } from '@/main/middlewares'

export default (router: Router): void => {
  router.post('/surveys', adminAuth, adaptRoute(makeAddSurveyController()))
  router.get('/surveys', normalAuth, adaptRoute(makeLoadSurveysController()))
}
