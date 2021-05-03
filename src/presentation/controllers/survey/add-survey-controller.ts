import { AddSurvey } from '@/domain/usecases'
import { Controller, Validation, HttpResponse } from '@/presentation/protocols'
import { badRequest, serverErrorRequest, noContentRequest } from '@/presentation/helpers'

export namespace AddSurveyController {
  export type Request = {
    question: string
    possibleAnswers: Answer[]
  }

  type Answer = {
    image?: string
    answer: string
  }
}

export class AddSurveyController implements Controller {
  constructor(private readonly validation: Validation, private readonly addSurvey: AddSurvey) {}

  async handle(request: AddSurveyController.Request): Promise<HttpResponse> {
    try {
      const validationError = this.validation.validate(request)
      if (validationError) {
        return badRequest(validationError)
      }
      const { question, possibleAnswers } = request

      await this.addSurvey.add({ question, possibleAnswers, date: new Date() })
      return noContentRequest()
    } catch (error) {
      return serverErrorRequest(error)
    }
  }
}
