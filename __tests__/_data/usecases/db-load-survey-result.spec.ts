import { DbLoadSurveyResult } from '@/data/usecases'
import { throwError } from '@/tests/_helpers'
import { LoadSurveyResultRepositorySpy, LoadSurveyByIdRepositorySpy } from '@/tests/_data/mocks'
import MockDate from 'mockdate'

type SutTypes = {
  sut: DbLoadSurveyResult
  loadSurveyResultRepositorySpy: LoadSurveyResultRepositorySpy
  loadSurveyByIdRepositorySpy: LoadSurveyByIdRepositorySpy
}
const makeSut = (): SutTypes => {
  const loadSurveyResultRepositorySpy = new LoadSurveyResultRepositorySpy()
  const loadSurveyByIdRepositorySpy = new LoadSurveyByIdRepositorySpy()
  const sut = new DbLoadSurveyResult(loadSurveyResultRepositorySpy, loadSurveyByIdRepositorySpy)
  return {
    sut,
    loadSurveyResultRepositorySpy,
    loadSurveyByIdRepositorySpy,
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
      const { sut, loadSurveyResultRepositorySpy, loadSurveyByIdRepositorySpy } = makeSut()
      loadSurveyResultRepositorySpy.result = null

      await sut.load('surveyId')
      expect(loadSurveyByIdRepositorySpy.id).toBe('surveyId')
    })
    test('Should throw if LoadSurveyByIdRepository throws', async () => {
      const { sut, loadSurveyResultRepositorySpy, loadSurveyByIdRepositorySpy } = makeSut()
      loadSurveyResultRepositorySpy.result = null
      loadSurveyByIdRepositorySpy.loadById = throwError
      const loadPromise = sut.load('surveyId')
      await expect(loadPromise).rejects.toThrow()
    })
    test('Should return a surveyResultModel with all answers with count 0 if LoadSurveyResultRepository return null', async () => {
      const { sut, loadSurveyResultRepositorySpy, loadSurveyByIdRepositorySpy } = makeSut()
      loadSurveyResultRepositorySpy.result = null

      const { date, question, id: surveyId, possibleAnswers } = loadSurveyByIdRepositorySpy.result
      const answers = possibleAnswers.map((answerObject) => ({
        ...answerObject,
        count: 0,
        percent: 0,
      }))
      const expectedSurveyResult = {
        date,
        question,
        surveyId,
        answers,
      }

      const loadedSurveyResult = await sut.load('surveyId')
      expect(loadedSurveyResult).toEqual(expectedSurveyResult)
    })
  })
  describe('success', () => {
    test('Should return a surveyResult on success', async () => {
      const { sut, loadSurveyResultRepositorySpy } = makeSut()
      const loadedSurveyResult = await sut.load('surveyId')
      expect(loadedSurveyResult).toEqual(loadSurveyResultRepositorySpy.result)
    })
  })
})
