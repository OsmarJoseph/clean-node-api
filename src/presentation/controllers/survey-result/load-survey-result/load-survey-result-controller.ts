import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { LoadSurveyById } from './load-survey-result-protocols'
import { forbidenRequest, serverErrorRequest } from '@/presentation/helpers/http/http-helper'
import { InvalidParamError } from '@/presentation/errors'

export class LoadSurveyResultController implements Controller {
  constructor (
    private readonly loadSurveyById: LoadSurveyById
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { params: { surveyId } } = httpRequest
      const loadedSurvey = await this.loadSurveyById.loadById(surveyId)
      if (!loadedSurvey) {
        return forbidenRequest(new InvalidParamError('surveyId'))
      }
    } catch (error) {
      return serverErrorRequest(error)
    }
  }
}
