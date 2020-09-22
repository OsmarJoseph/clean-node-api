import { LoadSurveyById } from './save-survey-result-protocols'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'

export class SaveSurveyResultController implements Controller {
  constructor (
    private readonly loadSurveyById: LoadSurveyById
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const { params } = httpRequest
    await this.loadSurveyById.loadById(params.surveyId)
    return null
  }
}
