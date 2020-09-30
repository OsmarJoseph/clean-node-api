import { LoadSurveyResultController } from './load-survey-result-controller'
import { LoadSurveyById } from './load-survey-result-protocols'
import { HttpRequest } from '@/presentation/protocols'
import { makeMockLoadSurveyById } from '@/presentation/test'

type SutTypes = {
  sut: LoadSurveyResultController
  loadSurveyByIdStub: LoadSurveyById
}
const makeMockRequest = (): HttpRequest => ({
  params: {
    surveyId: 'any_survey_id'
  }

})
const makeSut = (): SutTypes => {
  const loadSurveyByIdStub = makeMockLoadSurveyById()
  const sut = new LoadSurveyResultController(loadSurveyByIdStub)
  return {
    sut,
    loadSurveyByIdStub
  }
}
describe('LoadSurveyResultController', () => {
  test('should call loadSurveyById with correct surveyId',async () => {
    const { sut,loadSurveyByIdStub } = makeSut()
    const loadByIdSpy = jest.spyOn(loadSurveyByIdStub,'loadById')
    await sut.handle(makeMockRequest())
    expect(loadByIdSpy).toHaveBeenCalledWith('any_survey_id')
  })
})
