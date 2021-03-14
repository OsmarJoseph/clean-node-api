import { DbLoadSurveyResult } from '@/data/usecases'
import { throwError, makeMockSurveyResultModel } from '@/tests/domain-tests/mocks'
import { LoadSurveyResultRepositorySpy,LoadSurveyByIdRepositorySpy } from '@/tests/data-tests/mocks'
import MockDate from 'mockdate'

type SutTypes = {
  sut: DbLoadSurveyResult
  loadSurveyResultRepositorySpy: LoadSurveyResultRepositorySpy
  loadSurveyByIdRepositorySpy: LoadSurveyByIdRepositorySpy
}
const makeSut = (): SutTypes => {
  const loadSurveyResultRepositorySpy = new LoadSurveyResultRepositorySpy()
  const loadSurveyByIdRepositorySpy = new LoadSurveyByIdRepositorySpy()
  const sut = new DbLoadSurveyResult(
    loadSurveyResultRepositorySpy,
    loadSurveyByIdRepositorySpy
  )
  return {
    sut,
    loadSurveyResultRepositorySpy,
    loadSurveyByIdRepositorySpy
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
      const { sut, loadSurveyResultRepositorySpy } = makeSut()
      await sut.load('surveyId')
      expect(loadSurveyResultRepositorySpy.surveyId).toBe('surveyId')
    })
    test('Should throw if LoadSurveyResultRepository throws', async () => {
      const { sut, loadSurveyResultRepositorySpy } = makeSut()
      loadSurveyResultRepositorySpy.loadBySurveyId = throwError
      const loadPromise = sut.load('surveyId')
      await expect(loadPromise).rejects.toThrow()
    })
  })
  describe('LoadSurveyByIdRepository', () => {
    test('Should call LoadSurveyByIdRepository if LoadSurveyResultRepository return null', async () => {
      const { sut,loadSurveyResultRepositorySpy,loadSurveyByIdRepositorySpy } = makeSut()
      loadSurveyResultRepositorySpy.loadBySurveyId = () => null

      await sut.load('surveyId')
      expect(loadSurveyByIdRepositorySpy.id).toBe('surveyId')
    })
    test('Should throw if LoadSurveyByIdRepository throws', async () => {
      const {
        sut,
        loadSurveyResultRepositorySpy,
        loadSurveyByIdRepositorySpy
      } = makeSut()
      loadSurveyResultRepositorySpy.loadBySurveyId = () => null
      loadSurveyByIdRepositorySpy.loadById = throwError
      const loadPromise = sut.load('surveyId')
      await expect(loadPromise).rejects.toThrow()
    })
    test('Should return a surveyResultModel with all answers with count 0 if LoadSurveyResultRepository return null', async () => {
      const { sut, loadSurveyResultRepositorySpy } = makeSut()
      loadSurveyResultRepositorySpy.loadBySurveyId = () => null

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
