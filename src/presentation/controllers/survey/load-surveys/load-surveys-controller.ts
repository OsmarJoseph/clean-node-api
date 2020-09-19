import { Controller, HttpResponse, HttpRequest, LoadSurveys } from './load-surveys-protocols'
import { okRequest, serverErrorResponse } from '../../../helpers/http/http-helper'
export class LoadSurveysController implements Controller {
  constructor (private readonly loadSurveys: LoadSurveys) {}
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const surveysList = await this.loadSurveys.load()
      return okRequest(surveysList)
    } catch (error) {
      return serverErrorResponse(error)
    }
  }
}
