import { LoadSurveyById, SaveSurveyResult } from '@/domain/usecases'
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
    private readonly loadSurveyById: LoadSurveyById,
    private readonly saveSurveyResult: SaveSurveyResult
  ) {}

  async handle (
    request: SaveSurveyResultController.Request
  ): Promise<HttpResponse> {
    try {
      const { answer, surveyId, accountId } = request

      const loadedSurvey = await this.loadSurveyById.loadById(surveyId)
      if (!loadedSurvey) {
        return forbidenRequest(new InvalidParamError('surveyId'))
      }
      const thisAnswerIsOnTheLoadedSurvey = loadedSurvey.possibleAnswers.some(
        (surveyAnswer) => surveyAnswer.answer === answer
      )
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
