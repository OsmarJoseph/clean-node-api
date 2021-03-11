import { DbLoadSurveyResult } from '@/data/usecases'
import { LoadSurveyResultRepository, LoadSurveyByIdRepository } from '@/data/protocols'
import { throwError, makeMockSurveyResultModel } from '@/tests/domain-tests/mocks'
import { makeMockLoadSurveyResultRepository,makeMockLoadSurveyByIdRepository } from '@/tests/data-tests/mocks'
import MockDate from 'mockdate'

type SutTypes = {
  sut: DbLoadSurveyResult
  loadSurveyResultRepositoryStub: LoadSurveyResultRepository
  loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository
}
const makeSut = (): SutTypes => {
  const loadSurveyResultRepositoryStub = makeMockLoadSurveyResultRepository()
  const loadSurveyByIdRepositoryStub = makeMockLoadSurveyByIdRepository()
  const sut = new DbLoadSurveyResult(
    loadSurveyResultRepositoryStub,
    loadSurveyByIdRepositoryStub
  )
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
  describe('LoadSurveyResultRepository', () => {
    test('Should call LoadSurveyResultRepository with correct surveyId', async () => {
      const { sut, loadSurveyResultRepositoryStub } = makeSut()
      const loadBySurveyIdSpy = jest.spyOn(
        loadSurveyResultRepositoryStub,
        'loadBySurveyId'
      )
      await sut.load('surveyId')
      expect(loadBySurveyIdSpy).toHaveBeenCalledWith('surveyId')
    })
    test('Should throw if LoadSurveyResultRepository throws', async () => {
      const { sut, loadSurveyResultRepositoryStub } = makeSut()
      jest
        .spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId')
        .mockImplementationOnce(throwError)
      const loadPromise = sut.load('surveyId')
      await expect(loadPromise).rejects.toThrow()
    })
  })
  describe('LoadSurveyByIdRepository', () => {
    test('Should call LoadSurveyByIdRepository if LoadSurveyResultRepository return null', async () => {
      const {
        sut,
        loadSurveyResultRepositoryStub,
        loadSurveyByIdRepositoryStub
      } = makeSut()
      jest
        .spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId')
        .mockReturnValueOnce(Promise.resolve(null))
      const loadSurveyByIdSpy = jest.spyOn(
        loadSurveyByIdRepositoryStub,
        'loadById'
      )
      await sut.load('surveyId')
      expect(loadSurveyByIdSpy).toHaveBeenCalledWith('surveyId')
    })
    test('Should throw if LoadSurveyByIdRepository throws', async () => {
      const {
        sut,
        loadSurveyResultRepositoryStub,
        loadSurveyByIdRepositoryStub
      } = makeSut()
      jest
        .spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId')
        .mockReturnValueOnce(Promise.resolve(null))
      jest
        .spyOn(loadSurveyByIdRepositoryStub, 'loadById')
        .mockImplementationOnce(throwError)
      const loadPromise = sut.load('surveyId')
      await expect(loadPromise).rejects.toThrow()
    })
    test('Should return a surveyResultModel with all answers with count 0 if LoadSurveyResultRepository return null', async () => {
      const { sut, loadSurveyResultRepositoryStub } = makeSut()
      jest
        .spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId')
        .mockReturnValueOnce(Promise.resolve(null))
      const loadedSurveyResult = await sut.load('surveyId')
      expect(loadedSurveyResult).toEqual(makeMockSurveyResultModel())
    })
  })
  describe('success', () => {
    test('Should return a surveyResult on success', async () => {
      const { sut } = makeSut()
      const loadedSurveyResult = await sut.load('surveyId')
      expect(loadedSurveyResult).toEqual(makeMockSurveyResultModel())
    })
  })
})
