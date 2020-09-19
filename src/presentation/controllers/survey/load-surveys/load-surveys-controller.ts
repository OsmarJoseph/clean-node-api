import { Controller, HttpResponse, HttpRequest, LoadSurveys } from './load-surveys-protocols'
import { successResponse } from '../../../helpers/http/http-helper'
export class LoadSurveysController implements Controller {
  constructor (private readonly loadSurveys: LoadSurveys) {}
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const surveysList = await this.loadSurveys.load()
    return successResponse(surveysList)
  }
}
