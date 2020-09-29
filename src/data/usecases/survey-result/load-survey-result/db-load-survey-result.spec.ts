import { DbLoadSurveyResult } from './db-load-survey-result'
import { LoadSurveyResultRepository } from './db-load-survey-result-protocols'
import { throwError, makeMockSurveyResultModel } from '@/domain/test'
import { makeMockLoadSurveyResultRepository } from '@/data/test'
import MockDate from 'mockdate'

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
  beforeAll(() => {
    MockDate.set(new Date())
  })
  afterAll(() => {
    MockDate.reset()
  })
  test('Should call LoadSurveyResultRepository with correct surveyId',async () => {
    const { sut,loadSurveyResultRepositoryStub } = makeSut()
    const loadBySurveyIdSpy = jest.spyOn(loadSurveyResultRepositoryStub,'loadBySurveyId')
    await sut.load('surveyId')
    expect(loadBySurveyIdSpy).toHaveBeenCalledWith('surveyId')
  })
  test('Should throw if LoadSurveyResultRepository throws',async () => {
    const { sut,loadSurveyResultRepositoryStub } = makeSut()
    jest.spyOn(loadSurveyResultRepositoryStub,'loadBySurveyId').mockImplementationOnce(throwError)
    const loadPromise = sut.load('surveyId')
    await expect(loadPromise).rejects.toThrow()
  })
  test('Should return a surveyResult on success',async () => {
    const { sut } = makeSut()
    const loadedSurveyResult = await sut.load('surveyId')
    expect(loadedSurveyResult).toEqual(makeMockSurveyResultModel())
  })
})
