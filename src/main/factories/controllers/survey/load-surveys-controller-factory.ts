import { Controller } from '@/presentation/protocols'
import { LoadSurveysController } from '@/presentation/controllers'
import { makeDbLoadSurveys, makeLogControllerDecorator } from '@/main/factories'

export const makeLoadSurveysController = (): Controller => {
  const loadSurveysController = new LoadSurveysController(makeDbLoadSurveys())
  return makeLogControllerDecorator(loadSurveysController)
}
