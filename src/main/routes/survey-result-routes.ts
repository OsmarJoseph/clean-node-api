import { makeSaveSurveyResultController, makeLoadSurveyResultController } from '@/main/factories'
import { normalAuth } from '@/main/middlewares'
import { adaptRoute } from '@/main/adapters'
import { Router } from 'express'

export default (router: Router): void => {
  router.put('/surveys/:surveyId/results', normalAuth, adaptRoute(makeSaveSurveyResultController()))
  router.get('/surveys/:surveyId/results', normalAuth, adaptRoute(makeLoadSurveyResultController()))
}
