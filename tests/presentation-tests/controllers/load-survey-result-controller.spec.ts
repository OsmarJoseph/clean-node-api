import { LoadSurveyResultController } from '@/presentation/controllers'
import { throwError } from '@/tests/helpers'
import {
  CheckSurveyByIdSpy,
  LoadSurveyResultSpy
} from '@/tests/presentation-tests/mocks'
import {
  forbidenRequest,
  serverErrorRequest,
  okRequest
} from '@/presentation/helpers'
import { InvalidParamError } from '@/presentation/errors'

import MockDate from 'mockdate'
import faker from 'faker'

type SutTypes = {
  sut: LoadSurveyResultController
  checkSurveyByIdSpy: CheckSurveyByIdSpy
  loadSurveyResultSpy: LoadSurveyResultSpy
}
const mockRequest = (): LoadSurveyResultController.Request => ({
  surveyId: faker.random.uuid()
})

const makeSut = (): SutTypes => {
  const checkSurveyByIdSpy = new CheckSurveyByIdSpy()
  const loadSurveyResultSpy = new LoadSurveyResultSpy()
  const sut = new LoadSurveyResultController(
    checkSurveyByIdSpy,
    loadSurveyResultSpy
  )
  return {
    sut,
    checkSurveyByIdSpy,
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
  describe('checkSurveyById', () => {
    test('should call checkSurveyById with correct surveyId', async () => {
      const { sut, checkSurveyByIdSpy } = makeSut()
      await sut.handle(mockedRequest)
      expect(checkSurveyByIdSpy.id).toBe(mockedRequest.surveyId)
    })
    test('should return 403 if a invalid surveyId is provided', async () => {
      const { sut, checkSurveyByIdSpy } = makeSut()
      checkSurveyByIdSpy.result = false
      const httpResponse = await sut.handle(mockedRequest)
      expect(httpResponse).toEqual(
        forbidenRequest(new InvalidParamError('surveyId'))
      )
    })
    test('should return 500 if checkSurveyById throws', async () => {
      const { sut, checkSurveyByIdSpy } = makeSut()
      checkSurveyByIdSpy.checkById = throwError
      const httpResponse = await sut.handle(mockedRequest)
      expect(httpResponse).toEqual(serverErrorRequest(new Error()))
    })
  })
  describe('loadSurveyResult', () => {
    test('should call LoadSurveyResult with correct surveyId', async () => {
      const { sut, loadSurveyResultSpy } = makeSut()
      await sut.handle(mockedRequest)
      expect(loadSurveyResultSpy.surveyId).toBe(mockedRequest.surveyId)
    })
    test('should return 500 if LoadSurveyResult throws', async () => {
      const { sut, loadSurveyResultSpy } = makeSut()
      loadSurveyResultSpy.load = throwError
      const httpResponse = await sut.handle(mockedRequest)
      expect(httpResponse).toEqual(serverErrorRequest(new Error()))
    })
  })
  describe('success', () => {
    test('Should return 200 on success', async () => {
      const { sut, loadSurveyResultSpy } = makeSut()
      const httpResponse = await sut.handle(mockedRequest)
      expect(httpResponse).toEqual(okRequest(loadSurveyResultSpy.result))
    })
  })
})
