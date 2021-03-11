import { LoadSurveys } from '@/domain/usecases'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { okRequest, serverErrorRequest, noContentRequest } from '@/presentation/helpers'
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
