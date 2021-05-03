import { SaveSurveyResultController } from '@/presentation/controllers'
import { forbidenRequest, serverErrorRequest, okRequest } from '@/presentation/helpers'
import { InvalidParamError } from '@/presentation/errors'
import { throwError } from '@/tests/_helpers'
import { SaveSurveyResultSpy, LoadAnswersBySurveyIdSpy } from '@/tests/_presentation/mocks'

import MockDate from 'mockdate'
import faker from 'faker'

const mockRequest = (): SaveSurveyResultController.Request => ({
  surveyId: faker.random.uuid(),
  answer: faker.random.word(),
  accountId: faker.random.uuid(),
})

type SutTypes = {
  sut: SaveSurveyResultController
  loadSurveyByIdSpy: LoadAnswersBySurveyIdSpy
  saveSurveyResultSpy: SaveSurveyResultSpy
}
const makeSut = (): SutTypes => {
  const saveSurveyResultSpy = new SaveSurveyResultSpy()
  const loadSurveyByIdSpy = new LoadAnswersBySurveyIdSpy()
  const sut = new SaveSurveyResultController(loadSurveyByIdSpy, saveSurveyResultSpy)
  return {
    sut,
    loadSurveyByIdSpy,
    saveSurveyResultSpy,
  }
}

const assignAnswerToLoadAnswersBySurveyIdSpy = (
  answer: string,
  loadSurveyByIdSpy: LoadAnswersBySurveyIdSpy,
): void => {
  loadSurveyByIdSpy.result.push(answer)
}

describe('SaveSurveyResultController', () => {
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
  describe('LoadAnswersBySurveyId', () => {
    test('Should call LoadAnswersBySurveyId with correct id', async () => {
      const { sut, loadSurveyByIdSpy } = makeSut()
      await sut.handle(mockedRequest)
      expect(loadSurveyByIdSpy.id).toBe(mockedRequest.surveyId)
    })
    test('Should return 403 LoadAnswersBySurveyId returns null', async () => {
      const { sut, loadSurveyByIdSpy } = makeSut()
      loadSurveyByIdSpy.result = []
      const httpResponse = await sut.handle(mockedRequest)
      expect(httpResponse).toEqual(forbidenRequest(new InvalidParamError('surveyId')))
    })
    test('Should return 500 if LoadAnswersBySurveyId throws', async () => {
      const { sut, loadSurveyByIdSpy } = makeSut()
      loadSurveyByIdSpy.loadAnswers = throwError
      const httpResponse = await sut.handle(mockedRequest)
      expect(httpResponse).toEqual(serverErrorRequest(new Error()))
    })
  })
  describe('answer', () => {
    test('Should return 403 if an invalid answer is provided', async () => {
      const { sut } = makeSut()
      mockedRequest.answer = 'wrong_anwer'
      const httpResponse = await sut.handle(mockedRequest)
      expect(httpResponse).toEqual(forbidenRequest(new InvalidParamError('answer')))
    })
  })
  describe('SaveSurveyResult', () => {
    test('Should call SaveSurveyResult with correct values', async () => {
      const { sut, loadSurveyByIdSpy, saveSurveyResultSpy } = makeSut()
      const answer = mockedRequest.answer
      assignAnswerToLoadAnswersBySurveyIdSpy(answer, loadSurveyByIdSpy)
      await sut.handle(mockedRequest)
      expect(saveSurveyResultSpy.surveyResultParams).toEqual({
        surveyId: mockedRequest.surveyId,
        accountId: mockedRequest.accountId,
        answer,
        date: new Date(),
      })
    })
    test('Should return 500 if SaveSurveyResult throws', async () => {
      const { sut, loadSurveyByIdSpy, saveSurveyResultSpy } = makeSut()
      const answer = mockedRequest.answer
      assignAnswerToLoadAnswersBySurveyIdSpy(answer, loadSurveyByIdSpy)
      saveSurveyResultSpy.save = throwError
      const httpResponse = await sut.handle(mockedRequest)
      expect(httpResponse).toEqual(serverErrorRequest(new Error()))
    })
  })
  describe('success', () => {
    test('Should return 200 on success', async () => {
      const { sut, saveSurveyResultSpy, loadSurveyByIdSpy } = makeSut()
      const answer = mockedRequest.answer
      assignAnswerToLoadAnswersBySurveyIdSpy(answer, loadSurveyByIdSpy)
      const httpResponse = await sut.handle(mockedRequest)
      expect(httpResponse).toEqual(okRequest(saveSurveyResultSpy.result))
    })
  })
})
