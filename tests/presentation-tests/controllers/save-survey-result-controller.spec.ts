import { LoadSurveyById, SaveSurveyResult } from '@/domain/usecases'
import { SaveSurveyResultController } from '@/presentation/controllers'
import { HttpRequest } from '@/presentation/protocols'
import { forbidenRequest, serverErrorRequest, okRequest } from '@/presentation/helpers'
import { InvalidParamError } from '@/presentation/errors'
import { throwError, makeMockSurveyResultModel, makeSaveSurveyResultParams } from '@/tests/domain-tests/mocks'
import { makeMockSaveSurveyResult, makeMockLoadSurveyById } from '@/tests/presentation-tests/mocks'
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
  loadSurveyByIdStub: LoadSurveyById
  saveSurveyResultStub: SaveSurveyResult
}
const makeSut = (): SutTypes => {
  const saveSurveyResultStub = makeMockSaveSurveyResult()
  const loadSurveyByIdStub = makeMockLoadSurveyById()
  const sut = new SaveSurveyResultController(loadSurveyByIdStub,saveSurveyResultStub)
  return {
    sut,
    loadSurveyByIdStub,
    saveSurveyResultStub
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
      const { sut,loadSurveyByIdStub } = makeSut()
      const loadByIdSpy = jest.spyOn(loadSurveyByIdStub,'loadById')
      await sut.handle(makeMockRequest())
      expect(loadByIdSpy).toHaveBeenCalledWith('any_survey_id')
    })
    test('Should return 403 LoadSurveyById returns null', async () => {
      const { sut,loadSurveyByIdStub } = makeSut()
      jest.spyOn(loadSurveyByIdStub,'loadById').mockReturnValueOnce(Promise.resolve(null))
      const httpResponse = await sut.handle(makeMockRequest())
      expect(httpResponse).toEqual(forbidenRequest(new InvalidParamError('surveyId')))
    })
    test('Should return 500 if LoadSurveyById throws', async () => {
      const { sut,loadSurveyByIdStub } = makeSut()
      jest.spyOn(loadSurveyByIdStub,'loadById').mockImplementationOnce(throwError)
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
      const { sut,saveSurveyResultStub } = makeSut()
      const saveSpy = jest.spyOn(saveSurveyResultStub,'save')
      await sut.handle(makeMockRequest())
      expect(saveSpy).toHaveBeenCalledWith(makeSaveSurveyResultParams())
    })
    test('Should return 500 if SaveSurveyResult throws', async () => {
      const { sut,saveSurveyResultStub } = makeSut()
      jest.spyOn(saveSurveyResultStub,'save').mockImplementationOnce(throwError)
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
