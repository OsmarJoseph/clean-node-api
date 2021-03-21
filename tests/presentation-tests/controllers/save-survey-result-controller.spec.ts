import { SaveSurveyResultController } from '@/presentation/controllers'
import { HttpRequest } from '@/presentation/protocols'
import { forbidenRequest, serverErrorRequest, okRequest } from '@/presentation/helpers'
import { InvalidParamError } from '@/presentation/errors'
import { throwError } from '@/tests/domain-tests/mocks'
import { SaveSurveyResultSpy, LoadSurveyByIdSpy } from '@/tests/presentation-tests/mocks'

import MockDate from 'mockdate'
import faker from 'faker'

const mockRequest = (): HttpRequest => ({
  params: {
    surveyId: faker.random.uuid()
  },
  body: {
    answer: faker.random.word()
  },
  accountId: faker.random.uuid()
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

const assignAnswerToLoadSurveyByIdSpy = (answer: string,loadSurveyByIdSpy: LoadSurveyByIdSpy): void => {
  const newAnswer = {
    answer,
    image: faker.image.imageUrl()
  }
  loadSurveyByIdSpy.result.possibleAnswers.push(newAnswer)
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
  describe('LoadSurveyById', () => {
    test('Should call LoadSurveyById with correct id', async () => {
      const { sut,loadSurveyByIdSpy } = makeSut()
      await sut.handle(mockedRequest)
      expect(loadSurveyByIdSpy.id).toBe(mockedRequest.params.surveyId)
    })
    test('Should return 403 LoadSurveyById returns null', async () => {
      const { sut,loadSurveyByIdSpy } = makeSut()
      loadSurveyByIdSpy.result = null
      const httpResponse = await sut.handle(mockedRequest)
      expect(httpResponse).toEqual(forbidenRequest(new InvalidParamError('surveyId')))
    })
    test('Should return 500 if LoadSurveyById throws', async () => {
      const { sut,loadSurveyByIdSpy } = makeSut()
      loadSurveyByIdSpy.loadById = throwError
      const httpResponse = await sut.handle(mockedRequest)
      expect(httpResponse).toEqual(serverErrorRequest(new Error()))
    })
  })
  describe('answer', () => {
    test('Should return 403 if an invalid answer is provided', async () => {
      const { sut } = makeSut()
      const httpRequest = mockedRequest
      httpRequest.body.answer = 'wrong_anwer'
      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse).toEqual(forbidenRequest(new InvalidParamError('answer')))
    })
  })
  describe('SaveSurveyResult', () => {
    test('Should call SaveSurveyResult with correct values', async () => {
      const { sut,loadSurveyByIdSpy,saveSurveyResultSpy } = makeSut()
      const answer = mockedRequest.body.answer
      assignAnswerToLoadSurveyByIdSpy(answer,loadSurveyByIdSpy)
      await sut.handle(mockedRequest)
      expect(saveSurveyResultSpy.surveyResultData).toEqual({
        surveyId: mockedRequest.params.surveyId,
        accountId: mockedRequest.accountId,
        answer,
        date: new Date()
      })
    })
    test('Should return 500 if SaveSurveyResult throws', async () => {
      const { sut,loadSurveyByIdSpy,saveSurveyResultSpy } = makeSut()
      const answer = mockedRequest.body.answer
      assignAnswerToLoadSurveyByIdSpy(answer,loadSurveyByIdSpy)
      saveSurveyResultSpy.save = throwError
      const httpResponse = await sut.handle(mockedRequest)
      expect(httpResponse).toEqual(serverErrorRequest(new Error()))
    })
  })
  describe('success', () => {
    test('Should return 200 on success', async () => {
      const { sut,saveSurveyResultSpy,loadSurveyByIdSpy } = makeSut()
      const answer = mockedRequest.body.answer
      assignAnswerToLoadSurveyByIdSpy(answer,loadSurveyByIdSpy)
      const httpResponse = await sut.handle(mockedRequest)
      expect(httpResponse).toEqual(okRequest(saveSurveyResultSpy.result))
    })
  })
})
