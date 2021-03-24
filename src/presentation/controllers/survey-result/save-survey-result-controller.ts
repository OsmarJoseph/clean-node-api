import { LoadAnswersBySurveyId, SaveSurveyResult } from '@/domain/usecases'
import { Controller, HttpResponse } from '@/presentation/protocols'
import {
  forbidenRequest,
  serverErrorRequest,
  okRequest
} from '@/presentation/helpers'
import { InvalidParamError } from '@/presentation/errors'

export namespace SaveSurveyResultController {
  export type Request = {
    surveyId: string
    accountId: string
    answer: string
  }
}

export class SaveSurveyResultController implements Controller {
  constructor (
    private readonly loadAnswersBySurveyId: LoadAnswersBySurveyId,
    private readonly saveSurveyResult: SaveSurveyResult
  ) {}

  async handle (
    request: SaveSurveyResultController.Request
  ): Promise<HttpResponse> {
    try {
      const { answer, surveyId, accountId } = request

      const possibleAnswers = await this.loadAnswersBySurveyId.loadAnswers(surveyId)
      if (!possibleAnswers.length) {
        return forbidenRequest(new InvalidParamError('surveyId'))
      }

      const isValidAnswer = possibleAnswers.includes(answer)

      if (!isValidAnswer) {
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
