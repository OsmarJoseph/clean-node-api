import { DbSaveSurveyResult } from '@/data/usecases'
import { throwError,mockSaveSurveyResultParams } from '@/tests/domain-tests/mocks'
import { SaveSurveyResultRepositorySpy,LoadSurveyResultRepositorySpy } from '@/tests/data-tests/mocks'
import MockDate from 'mockdate'

type SutTypes = {
  sut: DbSaveSurveyResult
  saveSurveyResultRepositorySpy: SaveSurveyResultRepositorySpy
  loadSurveyResultRepositorySpy: LoadSurveyResultRepositorySpy
}

const makeSut = (): SutTypes => {
  const saveSurveyResultRepositorySpy = new SaveSurveyResultRepositorySpy()
  const loadSurveyResultRepositorySpy = new LoadSurveyResultRepositorySpy()
  const sut = new DbSaveSurveyResult(
    saveSurveyResultRepositorySpy,
    loadSurveyResultRepositorySpy
  )
  return {
    sut,
    saveSurveyResultRepositorySpy,
    loadSurveyResultRepositorySpy
  }
}
describe('DbSaveSurveyResult Usecase', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })
  afterAll(() => {
    MockDate.reset()
  })
  describe('SaveSurveyResultRepository', () => {
    test('Should call SaveSurveyResultRepository with correct values', async () => {
      const { sut, saveSurveyResultRepositorySpy } = makeSut()
      const surveyResultData = mockSaveSurveyResultParams()
      await sut.save(surveyResultData)
      expect(saveSurveyResultRepositorySpy.surveyResultParams).toBe(surveyResultData)
    })
    test('Should throw if SaveSurveyResultRepository throws', async () => {
      const { sut, saveSurveyResultRepositorySpy } = makeSut()
      saveSurveyResultRepositorySpy.save = throwError
      const savePromise = sut.save(mockSaveSurveyResultParams())
      await expect(savePromise).rejects.toThrow()
    })
  })
  describe('LoadSurveyResultRepository', () => {
    test('Should call LoadSurveyResultRepository with correct values', async () => {
      const { sut, loadSurveyResultRepositorySpy } = makeSut()

      const surveyResultData = mockSaveSurveyResultParams()
      await sut.save(surveyResultData)
      expect(loadSurveyResultRepositorySpy.surveyId).toBe(surveyResultData.surveyId)
    })
    test('Should throw if LoadSurveyResultRepository throws', async () => {
      const { sut, loadSurveyResultRepositorySpy } = makeSut()
      loadSurveyResultRepositorySpy.loadBySurveyId = throwError
      const savePromise = sut.save(mockSaveSurveyResultParams())
      await expect(savePromise).rejects.toThrow()
    })

    describe('success', () => {
      test('Should return a surveyResult on success', async () => {
        const { sut,loadSurveyResultRepositorySpy } = makeSut()
        const surveyResultResponse = await sut.save(
          mockSaveSurveyResultParams()
        )
        expect(surveyResultResponse).toEqual(loadSurveyResultRepositorySpy.result)
      })
    })
  })
})
