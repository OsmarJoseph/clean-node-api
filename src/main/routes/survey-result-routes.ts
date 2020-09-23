import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory'
import { makeSaveSurveyResultController } from '@/main/factories/controllers/survey-result/save-survey-result/save-survey-result-controller-factory'
import { normalAuth } from '@/main/middlewares/normal-auth'
import { adaptRoute } from '@/main/adapters/express/express-route-adapter'
import { Router } from 'express'

export default (router: Router): void => {
  router.put('/surveys/:surveyId/results',normalAuth, adaptRoute(makeLogControllerDecorator(makeSaveSurveyResultController())))
}
