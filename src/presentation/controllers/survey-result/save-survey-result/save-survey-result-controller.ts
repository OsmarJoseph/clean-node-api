import { LoadSurveyById, SaveSurveyResult } from './save-survey-result-protocols'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { forbidenRequest, serverErrorRequest, okRequest } from '@/presentation/helpers/http/http-helper'
import { InvalidParamError } from '@/presentation/errors'

export class SaveSurveyResultController implements Controller {
  constructor (
    private readonly loadSurveyById: LoadSurveyById,
    private readonly saveSurveyResult: SaveSurveyResult

  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { params,body ,accountId } = httpRequest
      const { answer } = body
      const { surveyId } = params
      const loadedSurvey = await this.loadSurveyById.loadById(surveyId)
      if (!loadedSurvey) {
        return forbidenRequest(new InvalidParamError('surveyId'))
      }
      const thisAnswerIsOnTheLoadedSurvey = loadedSurvey.possibleAnswers.some(surveyAnswer => surveyAnswer.answer === answer)
      if (!thisAnswerIsOnTheLoadedSurvey) {
        return forbidenRequest(new InvalidParamError('answer'))
      }

      const addedOrUpdatedSaveResult = await this.saveSurveyResult.save({
        surveyId,
        accountId,
        answer,
        date: new Date()
      })
      return okRequest(addedOrUpdatedSaveResult)
    } catch (error) {
      return serverErrorRequest(error)
    }
  }
}
