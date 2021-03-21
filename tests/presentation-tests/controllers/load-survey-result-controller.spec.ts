import { LoadSurveyResultController } from '@/presentation/controllers'
import { throwError } from '@/tests/domain-tests/mocks'
import { HttpRequest } from '@/presentation/protocols'
import { LoadSurveyByIdSpy, LoadSurveyResultSpy } from '@/tests/presentation-tests/mocks'
import { forbidenRequest, serverErrorRequest, okRequest } from '@/presentation/helpers'
import { InvalidParamError } from '@/presentation/errors'

import MockDate from 'mockdate'
import faker from 'faker'

type SutTypes = {
  sut: LoadSurveyResultController
  loadSurveyByIdSpy: LoadSurveyByIdSpy
  loadSurveyResultSpy: LoadSurveyResultSpy
}
const mockRequest = (): HttpRequest => ({
  params: {
    surveyId: faker.random.uuid()
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
  let mockedRequest = mockRequest()

  beforeEach(() => {
    mockedRequest = mockRequest()
  })
  beforeAll(() => {
    MockDate.set(new Date())
  })
  afterAll(() => {
    MockDate.reset()
  })
  describe('loadSurveyById',() => {
    test('should call loadSurveyById with correct surveyId',async () => {
      const { sut,loadSurveyByIdSpy } = makeSut()
      await sut.handle(mockedRequest)
      expect(loadSurveyByIdSpy.id).toBe(mockedRequest.params.surveyId)
    })
    test('should return 403 if a invalid surveyId is provided',async () => {
      const { sut,loadSurveyByIdSpy } = makeSut()
      loadSurveyByIdSpy.result = null
      const httpResponse = await sut.handle(mockedRequest)
      expect(httpResponse).toEqual(forbidenRequest(new InvalidParamError('surveyId')))
    })
    test('should return 500 if loadSurveyById throws',async () => {
      const { sut,loadSurveyByIdSpy } = makeSut()
      loadSurveyByIdSpy.loadById = throwError
      const httpResponse = await sut.handle(mockedRequest)
      expect(httpResponse).toEqual(serverErrorRequest(new Error()))
    })
  })
  describe('loadSurveyResult',() => {
    test('should call LoadSurveyResult with correct surveyId',async () => {
      const { sut,loadSurveyResultSpy } = makeSut()
      await sut.handle(mockedRequest)
      expect(loadSurveyResultSpy.surveyId).toBe(mockedRequest.params.surveyId)
    })
    test('should return 500 if LoadSurveyResult throws',async () => {
      const { sut,loadSurveyResultSpy } = makeSut()
      loadSurveyResultSpy.load = throwError
      const httpResponse = await sut.handle(mockedRequest)
      expect(httpResponse).toEqual(serverErrorRequest(new Error()))
    })
  })
  describe('success',() => {
    test('Should return 200 on success',async () => {
      const { sut,loadSurveyResultSpy } = makeSut()
      const httpResponse = await sut.handle(mockedRequest)
      expect(httpResponse).toEqual(okRequest(loadSurveyResultSpy.result))
    })
  })
})
