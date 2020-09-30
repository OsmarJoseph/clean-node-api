import { LoadSurveyResultController } from './load-survey-result-controller'
import { LoadSurveyById } from './load-survey-result-protocols'
import { throwError } from '@/domain/test'
import { HttpRequest } from '@/presentation/protocols'
import { makeMockLoadSurveyById } from '@/presentation/test'
import { forbidenRequest, serverErrorRequest } from '@/presentation/helpers/http/http-helper'
import { InvalidParamError } from '@/presentation/errors'

type SutTypes = {
  sut: LoadSurveyResultController
  loadSurveyByIdStub: LoadSurveyById
}
const makeMockRequest = (): HttpRequest => ({
  params: {
    surveyId: 'any_survey_id'
  }

})
const makeSut = (): SutTypes => {
  const loadSurveyByIdStub = makeMockLoadSurveyById()
  const sut = new LoadSurveyResultController(loadSurveyByIdStub)
  return {
    sut,
    loadSurveyByIdStub
  }
}
describe('LoadSurveyResultController', () => {
  describe('loadSurveyById',() => {
    test('should call loadSurveyById with correct surveyId',async () => {
      const { sut,loadSurveyByIdStub } = makeSut()
      const loadByIdSpy = jest.spyOn(loadSurveyByIdStub,'loadById')
      await sut.handle(makeMockRequest())
      expect(loadByIdSpy).toHaveBeenCalledWith('any_survey_id')
    })
    test('should return 403 if a invalid surveyId is provided',async () => {
      const { sut,loadSurveyByIdStub } = makeSut()
      jest.spyOn(loadSurveyByIdStub,'loadById').mockReturnValueOnce(Promise.resolve(null))
      const httpResponse = await sut.handle(makeMockRequest())
      expect(httpResponse).toEqual(forbidenRequest(new InvalidParamError('surveyId')))
    })
    test('should return 500 if loadSurveyById throws',async () => {
      const { sut,loadSurveyByIdStub } = makeSut()
      jest.spyOn(loadSurveyByIdStub,'loadById').mockImplementationOnce(throwError)
      const httpResponse = await sut.handle(makeMockRequest())
      expect(httpResponse).toEqual(serverErrorRequest(new Error()))
    })
  })
})
