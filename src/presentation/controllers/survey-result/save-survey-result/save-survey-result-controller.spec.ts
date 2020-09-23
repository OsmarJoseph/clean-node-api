import { SaveSurveyResultController } from './save-survey-result-controller'
import { SurveyModel, LoadSurveyById,SaveSurveyResultModel, SaveSurveyResult,SurveyResultModel } from './save-survey-result-protocols'
import { HttpRequest } from '@/presentation/protocols'
import { forbidenRequest, serverErrorRequest, okRequest } from '@/presentation/helpers/http/http-helper'
import { InvalidParamError } from '@/presentation/errors'
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
const makeMockSurvey = (): SurveyModel => (
  {
    id: 'any_survey_id',
    question: 'any_question',
    possibleAnswers: [{
      image: 'any_image',
      answer: 'any_answer'
    }],
    date: new Date()
  }
)

const makeSaveSurveyResultData = (): SaveSurveyResultModel => ({
  surveyId: 'any_survey_id',
  accountId: 'any_account_id',
  answer: 'any_answer',
  date: new Date()
})
const makeMockSurveyResult = (): SurveyResultModel => ({
  id: 'any_survey_result_id',
  ...makeSaveSurveyResultData()
})
const makeSaveSurveyResult = (): SaveSurveyResult => {
  class SaveSurveyResultStub implements SaveSurveyResult {
    async save (surveyResultData: SaveSurveyResultModel): Promise<SurveyResultModel> {
      return makeMockSurveyResult()
    }
  }
  return new SaveSurveyResultStub()
}

const makeLoadSurveyById = (): LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    async loadById (id: string): Promise<SurveyModel> {
      return makeMockSurvey()
    }
  }
  return new LoadSurveyByIdStub()
}
type SutTypes = {
  sut: SaveSurveyResultController
  loadSurveyByIdStub: LoadSurveyById
  saveSurveyResultStub: SaveSurveyResult
}
const makeSut = (): SutTypes => {
  const saveSurveyResultStub = makeSaveSurveyResult()
  const loadSurveyByIdStub = makeLoadSurveyById()
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
      jest.spyOn(loadSurveyByIdStub,'loadById').mockReturnValueOnce(new Promise(resolve => resolve(null)))
      const httpResponse = await sut.handle(makeMockRequest())
      expect(httpResponse).toEqual(forbidenRequest(new InvalidParamError('surveyId')))
    })
    test('Should return 500 if LoadSurveyById throws', async () => {
      const { sut,loadSurveyByIdStub } = makeSut()
      jest.spyOn(loadSurveyByIdStub,'loadById').mockReturnValueOnce(new Promise((resolve,reject) => reject(new Error())))
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
      expect(saveSpy).toHaveBeenCalledWith(makeSaveSurveyResultData())
    })
    test('Should return 500 if SaveSurveyResult throws', async () => {
      const { sut,saveSurveyResultStub } = makeSut()
      jest.spyOn(saveSurveyResultStub,'save').mockReturnValueOnce(new Promise((resolve,reject) => reject(new Error())))
      const httpResponse = await sut.handle(makeMockRequest())
      expect(httpResponse).toEqual(serverErrorRequest(new Error()))
    })
  })
  describe('success', () => {
    test('Should return 200 on success', async () => {
      const { sut } = makeSut()
      const httpResponse = await sut.handle(makeMockRequest())
      expect(httpResponse).toEqual(okRequest(makeMockSurveyResult()))
    })
  })
})
