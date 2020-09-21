import { Controller, HttpResponse, HttpRequest, LoadSurveys } from './load-surveys-protocols'
import { okRequest, serverErrorRequest, noContentRequest } from '@/presentation/helpers/http/http-helper'
export class LoadSurveysController implements Controller {
  constructor (private readonly loadSurveys: LoadSurveys) {}
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const surveysList = await this.loadSurveys.load()
      return surveysList.length ? okRequest(surveysList) : noContentRequest()
    } catch (error) {
      return serverErrorRequest(error)
    }
  }
}
