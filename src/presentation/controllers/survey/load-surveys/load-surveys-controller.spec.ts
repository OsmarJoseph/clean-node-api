import { LoadSurveysController } from './load-surveys-controller'
import { SurveyModel, LoadSurveys } from './load-surveys-protocols'
import { okRequest, serverErrorRequest, noContentRequest } from '../../../helpers/http/http-helper'
import MockDate from 'mockdate'
const makeMockSurvey = (): SurveyModel => (
  {
    id: 'any_id',
    question: 'any_question',
    possibleAnswers: [{
      image: 'any_image',
      answer: 'any_answer'
    }],
    date: new Date()
  }
)
const makeMockSurveysList = (): SurveyModel[] => [
  makeMockSurvey(),makeMockSurvey()
]
const makeLoadSurveys = (): LoadSurveys => {
  class LoadSurveysStub implements LoadSurveys {
    async load (): Promise<SurveyModel[]> {
      return makeMockSurveysList()
    }
  }
  return new LoadSurveysStub()
}
interface SutTypes {
  sut: LoadSurveysController
  loadSurveysStub: LoadSurveys
}
const makeSut = (): SutTypes => {
  const loadSurveysStub = makeLoadSurveys()
  const sut = new LoadSurveysController(loadSurveysStub)
  return {
    sut,
    loadSurveysStub
  }
}
describe('Load Suveys Controller',() => {
  beforeAll(() => {
    MockDate.set(new Date())
  })
  afterAll(() => {
    MockDate.reset()
  })
  test('Should call LoadSurveys', async () => {
    const { sut,loadSurveysStub } = makeSut()
    const loadSpy = jest.spyOn(loadSurveysStub,'load')
    await sut.handle({})
    expect(loadSpy).toHaveBeenCalled()
  })
  test('Should return 204 if LoadSurveys return empty', async () => {
    const { sut,loadSurveysStub } = makeSut()
    jest.spyOn(loadSurveysStub,'load').mockReturnValueOnce(new Promise(resolve => resolve([])))
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(noContentRequest())
  })
  test('Should return 200 on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(okRequest(makeMockSurveysList()))
  })
  test('Should return 500 if LoadSurveys throws', async () => {
    const { sut,loadSurveysStub } = makeSut()
    jest.spyOn(loadSurveysStub,'load').mockReturnValueOnce(new Promise((resolve,reject) => reject(new Error())))
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(serverErrorRequest(new Error()))
  })
})
