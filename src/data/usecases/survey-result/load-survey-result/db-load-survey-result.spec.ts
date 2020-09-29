import { DbLoadSurveyResult } from './db-load-survey-result'
import { LoadSurveyResultRepository } from './db-load-survey-result-protocols'
import { makeMockLoadSurveyResultRepository } from '@/data/test'

type SutTypes = {
  sut: DbLoadSurveyResult
  loadSurveyResultRepositoryStub: LoadSurveyResultRepository
}
const makeSut = (): SutTypes => {
  const loadSurveyResultRepositoryStub = makeMockLoadSurveyResultRepository()
  const sut = new DbLoadSurveyResult(loadSurveyResultRepositoryStub)
  return {
    sut,
    loadSurveyResultRepositoryStub
  }
}
describe('DbLoadSurveyResult Usecase', () => {
  test('Should call LoadSurveyResultRepository with correct surveyId',async () => {
    const { sut,loadSurveyResultRepositoryStub } = makeSut()
    const loadBySurveyIdSpy = jest.spyOn(loadSurveyResultRepositoryStub,'loadBySurveyId')
    await sut.load('surveyId')
    expect(loadBySurveyIdSpy).toHaveBeenCalledWith('surveyId')
  })
})
