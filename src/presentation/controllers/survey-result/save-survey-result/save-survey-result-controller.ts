import { LoadSurveyById } from './save-survey-result-protocols'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { forbidenRequest, serverErrorRequest } from '@/presentation/helpers/http/http-helper'
import { InvalidParamError } from '@/presentation/errors'

export class SaveSurveyResultController implements Controller {
  constructor (
    private readonly loadSurveyById: LoadSurveyById
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { params } = httpRequest
      const loadedSurvey = await this.loadSurveyById.loadById(params.surveyId)
      if (!loadedSurvey) {
        return forbidenRequest(new InvalidParamError('surveyId'))
      }
    } catch (error) {
      return serverErrorRequest(error)
    }
  }
}
