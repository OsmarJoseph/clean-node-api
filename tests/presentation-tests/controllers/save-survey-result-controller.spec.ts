import { SaveSurveyResultController } from '@/presentation/controllers'
import { HttpRequest } from '@/presentation/protocols'
import { forbidenRequest, serverErrorRequest, okRequest } from '@/presentation/helpers'
import { InvalidParamError } from '@/presentation/errors'
import { throwError, makeMockSurveyResultModel, makeSaveSurveyResultParams } from '@/tests/domain-tests/mocks'
import { SaveSurveyResultSpy, LoadSurveyByIdSpy } from '@/tests/presentation-tests/mocks'
import MockDate from 'mockdate'

const makeMockRequest = (): HttpRequest => ({
  params: {
    surveyId: 'any_survey_id'
  },
  body: {
    answer: 'any_answer'
  },
  accountId: 'any_account_id'
})

type SutTypes = {
  sut: SaveSurveyResultController
  loadSurveyByIdSpy: LoadSurveyByIdSpy
  saveSurveyResultSpy: SaveSurveyResultSpy
}
const makeSut = (): SutTypes => {
  const saveSurveyResultSpy = new SaveSurveyResultSpy()
  const loadSurveyByIdSpy = new LoadSurveyByIdSpy()
  const sut = new SaveSurveyResultController(loadSurveyByIdSpy,saveSurveyResultSpy)
  return {
    sut,
    loadSurveyByIdSpy,
    saveSurveyResultSpy
  }
}
describe('SaveSurveyResultController', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })
  afterAll(() => {
    MockDate.reset()
  })
  describe('LoadSurveyById', () => {
    test('Should call LoadSurveyById with correct id', async () => {
      const { sut,loadSurveyByIdSpy } = makeSut()
      await sut.handle(makeMockRequest())
      expect(loadSurveyByIdSpy.id).toBe('any_survey_id')
    })
    test('Should return 403 LoadSurveyById returns null', async () => {
      const { sut,loadSurveyByIdSpy } = makeSut()
      loadSurveyByIdSpy.result = null
      const httpResponse = await sut.handle(makeMockRequest())
      expect(httpResponse).toEqual(forbidenRequest(new InvalidParamError('surveyId')))
    })
    test('Should return 500 if LoadSurveyById throws', async () => {
      const { sut,loadSurveyByIdSpy } = makeSut()
      loadSurveyByIdSpy.loadById = throwError
      const httpResponse = await sut.handle(makeMockRequest())
      expect(httpResponse).toEqual(serverErrorRequest(new Error()))
    })
  })
  describe('answer', () => {
    test('Should return 403 if an invalid answer is provided', async () => {
      const { sut } = makeSut()
      const httpRequest = makeMockRequest()
      httpRequest.body.answer = 'wrong_anwer'
      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse).toEqual(forbidenRequest(new InvalidParamError('answer')))
    })
  })
  describe('SaveSurveyResult', () => {
    test('Should call SaveSurveyResult with correct values', async () => {
      const { sut,saveSurveyResultSpy } = makeSut()
      await sut.handle(makeMockRequest())
      expect(saveSurveyResultSpy.surveyResultData).toEqual(makeSaveSurveyResultParams())
    })
    test('Should return 500 if SaveSurveyResult throws', async () => {
      const { sut,saveSurveyResultSpy } = makeSut()
      saveSurveyResultSpy.save = throwError
      const httpResponse = await sut.handle(makeMockRequest())
      expect(httpResponse).toEqual(serverErrorRequest(new Error()))
    })
  })
  describe('success', () => {
    test('Should return 200 on success', async () => {
      const { sut } = makeSut()
      const httpResponse = await sut.handle(makeMockRequest())
      expect(httpResponse).toEqual(okRequest(makeMockSurveyResultModel()))
    })
  })
})
