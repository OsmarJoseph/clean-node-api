import { DbSaveSurveyResult } from './db-save-survey-result'
import { SaveSurveyResultRepository } from './db-save-survey-result-protocols'
import { throwError , makeSaveSurveyResultParams, makeMockSurveyResultModel } from '@/domain/test'
import { makeMockSaveSurveyResultRepository } from '@/data/test'
import MockDate from 'mockdate'

type SutTypes = {
  sut: DbSaveSurveyResult
  saveSurveyResultRepositoryStub: SaveSurveyResultRepository
}

const makeSut = (): SutTypes => {
  const saveSurveyResultRepositoryStub = makeMockSaveSurveyResultRepository()
  const sut = new DbSaveSurveyResult(saveSurveyResultRepositoryStub)
  return {
    sut,
    saveSurveyResultRepositoryStub
  }
}
describe('DbSaveSurveyResult Usecase', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })
  afterAll(() => {
    MockDate.reset()
  })
  test('Should call SaveSurveyResultRepository with correct values', async () => {
    const { sut,saveSurveyResultRepositoryStub } = makeSut()
    const saveSpy = jest.spyOn(saveSurveyResultRepositoryStub,'save')
    const surveyResultData = makeSaveSurveyResultParams()
    await sut.save(surveyResultData)
    expect(saveSpy).toBeCalledWith(surveyResultData)
  })
  test('Should throw if SaveSurveyResultRepository throws', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut()
    jest.spyOn(saveSurveyResultRepositoryStub,'save').mockImplementationOnce(throwError)
    const savePromise = sut.save(makeSaveSurveyResultParams())
    await expect(savePromise).rejects.toThrow()
  })
  test('Should return a surveyResult on success', async () => {
    const { sut } = makeSut()
    const surveyResultResponse = await sut.save(makeSaveSurveyResultParams())
    expect(surveyResultResponse).toEqual(makeMockSurveyResultModel())
  })
})
