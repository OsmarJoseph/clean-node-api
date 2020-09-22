import { LoadSurveyById } from './save-survey-result-protocols'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { forbidenRequest } from '@/presentation/helpers/http/http-helper'
import { InvalidParamError } from '@/presentation/errors'

export class SaveSurveyResultController implements Controller {
  constructor (
    private readonly loadSurveyById: LoadSurveyById
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const { params } = httpRequest
    const loadedSurvey = await this.loadSurveyById.loadById(params.surveyId)
    if (!loadedSurvey) {
      return forbidenRequest(new InvalidParamError('surveyId'))
    }
  }
}
