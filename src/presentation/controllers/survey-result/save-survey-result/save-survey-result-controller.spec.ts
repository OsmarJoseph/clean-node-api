import { SaveSurveyResultController } from './save-survey-result-controller'
import { SurveyModel, LoadSurveyById } from './save-survey-result-protocols'
import { HttpRequest } from '@/presentation/protocols'
import { forbidenRequest, serverErrorRequest } from '@/presentation/helpers/http/http-helper'
import { InvalidParamError } from '@/presentation/errors'

const makeMockRequest = (): HttpRequest => ({
  params: {
    surveyId: 'any_survey_id'
  }
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
  loadSurveyById: LoadSurveyById
}
const makeSut = (): SutTypes => {
  const loadSurveyById = makeLoadSurveyById()
  const sut = new SaveSurveyResultController(loadSurveyById)
  return {
    sut,
    loadSurveyById
  }
}
describe('SaveSurveyResultController', () => {
  describe('LoadSurveyById', () => {
    test('Should call LoadSurveyById with correct id', async () => {
      const { sut,loadSurveyById } = makeSut()
      const loadByIdSpy = jest.spyOn(loadSurveyById,'loadById')
      await sut.handle(makeMockRequest())
      expect(loadByIdSpy).toHaveBeenCalledWith('any_survey_id')
    })
    test('Should return 403 LoadSurveyById returns null', async () => {
      const { sut,loadSurveyById } = makeSut()
      jest.spyOn(loadSurveyById,'loadById').mockReturnValueOnce(new Promise(resolve => resolve(null)))
      const httpResponse = await sut.handle(makeMockRequest())
      expect(httpResponse).toEqual(forbidenRequest(new InvalidParamError('surveyId')))
    })
    test('Should return 500 if LoadSurveyById throws', async () => {
      const { sut,loadSurveyById } = makeSut()
      jest.spyOn(loadSurveyById,'loadById').mockReturnValueOnce(new Promise((resolve,reject) => reject(new Error())))
      const httpResponse = await sut.handle(makeMockRequest())
      expect(httpResponse).toEqual(serverErrorRequest(new Error()))
    })
  })
})
