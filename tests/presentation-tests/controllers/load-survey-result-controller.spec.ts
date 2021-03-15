import { LoadSurveyResultController } from '@/presentation/controllers'
import { throwError, makeMockSurveyResultModel } from '@/tests/domain-tests/mocks'
import { HttpRequest } from '@/presentation/protocols'
import { LoadSurveyByIdSpy, LoadSurveyResultSpy } from '@/tests/presentation-tests/mocks'
import { forbidenRequest, serverErrorRequest, okRequest } from '@/presentation/helpers'
import { InvalidParamError } from '@/presentation/errors'
import MockDate from 'mockdate'

type SutTypes = {
  sut: LoadSurveyResultController
  loadSurveyByIdSpy: LoadSurveyByIdSpy
  loadSurveyResultSpy: LoadSurveyResultSpy
}
const makeMockRequest = (): HttpRequest => ({
  params: {
    surveyId: 'any_survey_id'
  }

})
const makeSut = (): SutTypes => {
  const loadSurveyByIdSpy = new LoadSurveyByIdSpy()
  const loadSurveyResultSpy = new LoadSurveyResultSpy()
  const sut = new LoadSurveyResultController(loadSurveyByIdSpy,loadSurveyResultSpy)
  return {
    sut,
    loadSurveyByIdSpy,
    loadSurveyResultSpy
  }
}
describe('LoadSurveyResultController', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })
  afterAll(() => {
    MockDate.reset()
  })
  describe('loadSurveyById',() => {
    test('should call loadSurveyById with correct surveyId',async () => {
      const { sut,loadSurveyByIdSpy } = makeSut()
      await sut.handle(makeMockRequest())
      expect(loadSurveyByIdSpy.id).toBe('any_survey_id')
    })
    test('should return 403 if a invalid surveyId is provided',async () => {
      const { sut,loadSurveyByIdSpy } = makeSut()
      loadSurveyByIdSpy.result = null
      const httpResponse = await sut.handle(makeMockRequest())
      expect(httpResponse).toEqual(forbidenRequest(new InvalidParamError('surveyId')))
    })
    test('should return 500 if loadSurveyById throws',async () => {
      const { sut,loadSurveyByIdSpy } = makeSut()
      loadSurveyByIdSpy.loadById = throwError
      const httpResponse = await sut.handle(makeMockRequest())
      expect(httpResponse).toEqual(serverErrorRequest(new Error()))
    })
  })
  describe('loadSurveyResult',() => {
    test('should call LoadSurveyResult with correct surveyId',async () => {
      const { sut,loadSurveyResultSpy } = makeSut()
      await sut.handle(makeMockRequest())
      expect(loadSurveyResultSpy.surveyId).toBe('any_survey_id')
    })
    test('should return 500 if LoadSurveyResult throws',async () => {
      const { sut,loadSurveyResultSpy } = makeSut()
      loadSurveyResultSpy.load = throwError
      const httpResponse = await sut.handle(makeMockRequest())
      expect(httpResponse).toEqual(serverErrorRequest(new Error()))
    })
  })
  describe('success',() => {
    test('Should return 200 on success',async () => {
      const { sut } = makeSut()
      const httpResponse = await sut.handle(makeMockRequest())
      expect(httpResponse).toEqual(okRequest(makeMockSurveyResultModel()))
    })
  })
})
