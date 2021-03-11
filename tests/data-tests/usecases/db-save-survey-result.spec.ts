import { DbSaveSurveyResult } from '@/data/usecases'
import { SaveSurveyResultRepository, LoadSurveyResultRepository } from '@/data/protocols'
import { throwError,makeSaveSurveyResultParams,makeMockSurveyResultModel } from '@/tests/domain-tests/mocks'
import { makeMockSaveSurveyResultRepository,makeMockLoadSurveyResultRepository } from '@/tests/data-tests/mocks'
import MockDate from 'mockdate'

type SutTypes = {
  sut: DbSaveSurveyResult
  saveSurveyResultRepositoryStub: SaveSurveyResultRepository
  loadSurveyResultRepositoryStub: LoadSurveyResultRepository
}

const makeSut = (): SutTypes => {
  const saveSurveyResultRepositoryStub = makeMockSaveSurveyResultRepository()
  const loadSurveyResultRepositoryStub = makeMockLoadSurveyResultRepository()
  const sut = new DbSaveSurveyResult(
    saveSurveyResultRepositoryStub,
    loadSurveyResultRepositoryStub
  )
  return {
    sut,
    saveSurveyResultRepositoryStub,
    loadSurveyResultRepositoryStub
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
      const { sut, saveSurveyResultRepositoryStub } = makeSut()
      const saveSpy = jest.spyOn(saveSurveyResultRepositoryStub, 'save')
      const surveyResultData = makeSaveSurveyResultParams()
      await sut.save(surveyResultData)
      expect(saveSpy).toBeCalledWith(surveyResultData)
    })
    test('Should throw if SaveSurveyResultRepository throws', async () => {
      const { sut, saveSurveyResultRepositoryStub } = makeSut()
      jest
        .spyOn(saveSurveyResultRepositoryStub, 'save')
        .mockImplementationOnce(throwError)
      const savePromise = sut.save(makeSaveSurveyResultParams())
      await expect(savePromise).rejects.toThrow()
    })
  })
  describe('LoadSurveyResultRepository', () => {
    test('Should call LoadSurveyResultRepository with correct values', async () => {
      const { sut, loadSurveyResultRepositoryStub } = makeSut()
      const loadBySurveyIdSpy = jest.spyOn(
        loadSurveyResultRepositoryStub,
        'loadBySurveyId'
      )
      const surveyResultData = makeSaveSurveyResultParams()
      await sut.save(surveyResultData)
      expect(loadBySurveyIdSpy).toBeCalledWith('any_survey_id')
    })
    test('Should throw if LoadSurveyResultRepository throws', async () => {
      const { sut, loadSurveyResultRepositoryStub } = makeSut()
      jest
        .spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId')
        .mockImplementationOnce(throwError)
      const savePromise = sut.save(makeSaveSurveyResultParams())
      await expect(savePromise).rejects.toThrow()
    })

    describe('success', () => {
      test('Should return a surveyResult on success', async () => {
        const { sut } = makeSut()
        const surveyResultResponse = await sut.save(
          makeSaveSurveyResultParams()
        )
        expect(surveyResultResponse).toEqual(makeMockSurveyResultModel())
      })
    })
  })
})
