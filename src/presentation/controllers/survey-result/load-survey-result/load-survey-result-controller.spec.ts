import { LoadSurveyResultController } from './load-survey-result-controller'
import { LoadSurveyById,LoadSurveyResult } from './load-survey-result-protocols'
import { throwError } from '@/domain/test'
import { HttpRequest } from '@/presentation/protocols'
import { makeMockLoadSurveyById, makeMockLoadSurveyResult } from '@/presentation/test'
import { forbidenRequest, serverErrorRequest } from '@/presentation/helpers/http/http-helper'
import { InvalidParamError } from '@/presentation/errors'

type SutTypes = {
  sut: LoadSurveyResultController
  loadSurveyByIdStub: LoadSurveyById
  loadSurveyResultStub: LoadSurveyResult
}
const makeMockRequest = (): HttpRequest => ({
  params: {
    surveyId: 'any_survey_id'
  }

})
const makeSut = (): SutTypes => {
  const loadSurveyByIdStub = makeMockLoadSurveyById()
  const loadSurveyResultStub = makeMockLoadSurveyResult()
  const sut = new LoadSurveyResultController(loadSurveyByIdStub,loadSurveyResultStub)
  return {
    sut,
    loadSurveyByIdStub,
    loadSurveyResultStub
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
  describe('loadSurveyResult',() => {
    test('should call LoadSurveyResult with correct surveyId',async () => {
      const { sut,loadSurveyResultStub } = makeSut()
      const loadSurveySpy = jest.spyOn(loadSurveyResultStub,'load')
      await sut.handle(makeMockRequest())
      expect(loadSurveySpy).toHaveBeenCalledWith('any_survey_id')
    })
    test('should return 500 if LoadSurveyResult throws',async () => {
      const { sut,loadSurveyResultStub } = makeSut()
      jest.spyOn(loadSurveyResultStub,'load').mockImplementationOnce(throwError)
      const httpResponse = await sut.handle(makeMockRequest())
      expect(httpResponse).toEqual(serverErrorRequest(new Error()))
    })
  })
})
