import { CheckSurveyById, LoadSurveyResult } from '@/domain/usecases'
import { Controller, HttpResponse } from '@/presentation/protocols'
import {
  forbidenRequest,
  serverErrorRequest,
  okRequest
} from '@/presentation/helpers'
import { InvalidParamError } from '@/presentation/errors'

export namespace LoadSurveyResultController {
  export type Request = {
    surveyId: string
  }
}

export class LoadSurveyResultController implements Controller {
  constructor (
    private readonly checkSurveyById: CheckSurveyById,
    private readonly loadSurveyResult: LoadSurveyResult
  ) {}

  async handle (
    request: LoadSurveyResultController.Request
  ): Promise<HttpResponse> {
    try {
      const { surveyId } = request
      const existsSurvey = await this.checkSurveyById.checkById(surveyId)
      if (!existsSurvey) {
        return forbidenRequest(new InvalidParamError('surveyId'))
      }
      const loadedSurveyResult = await this.loadSurveyResult.load(surveyId)
      return okRequest(loadedSurveyResult)
    } catch (error) {
      return serverErrorRequest(error)
    }
  }
}
