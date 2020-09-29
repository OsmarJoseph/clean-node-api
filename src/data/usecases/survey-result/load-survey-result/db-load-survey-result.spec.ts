import { DbLoadSurveyResult } from './db-load-survey-result'
import { LoadSurveyResultRepository,LoadSurveyByIdRepository } from './db-load-survey-result-protocols'
import { throwError, makeMockSurveyResultModel } from '@/domain/test'
import { makeMockLoadSurveyResultRepository, makeMockLoadSurveyByIdRepository } from '@/data/test'
import MockDate from 'mockdate'

type SutTypes = {
  sut: DbLoadSurveyResult
  loadSurveyResultRepositoryStub: LoadSurveyResultRepository
  loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository
}
const makeSut = (): SutTypes => {
  const loadSurveyResultRepositoryStub = makeMockLoadSurveyResultRepository()
  const loadSurveyByIdRepositoryStub = makeMockLoadSurveyByIdRepository()
  const sut = new DbLoadSurveyResult(loadSurveyResultRepositoryStub,loadSurveyByIdRepositoryStub)
  return {
    sut,
    loadSurveyResultRepositoryStub,
    loadSurveyByIdRepositoryStub
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
  test('Should call LoadSurveyByIdRepository if LoadSurveyResultRepository return null',async () => {
    const { sut,loadSurveyResultRepositoryStub,loadSurveyByIdRepositoryStub } = makeSut()
    jest.spyOn(loadSurveyResultRepositoryStub,'loadBySurveyId').mockReturnValueOnce(Promise.resolve(null))
    const loadSurveyByIdSpy = jest.spyOn(loadSurveyByIdRepositoryStub,'loadById')
    await sut.load('surveyId')
    expect(loadSurveyByIdSpy).toHaveBeenCalledWith('surveyId')
  })
  test('Should return a surveyResult on success',async () => {
    const { sut } = makeSut()
    const loadedSurveyResult = await sut.load('surveyId')
    expect(loadedSurveyResult).toEqual(makeMockSurveyResultModel())
  })
})
