import { makeDbLoadSurveyById , makeDbSaveSurveyResult , makeLogControllerDecorator } from '@/main/factories'
import { SaveSurveyResultController } from '@/presentation/controllers/'
import { Controller } from '@/presentation/protocols'

export const makeSaveSurveyResultController = (): Controller => {
  const saveSurveyResultController = new SaveSurveyResultController(
    makeDbLoadSurveyById(),
    makeDbSaveSurveyResult()
  )
  return makeLogControllerDecorator(saveSurveyResultController)
}
