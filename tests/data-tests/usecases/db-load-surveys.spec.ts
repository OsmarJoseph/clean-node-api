import { DbLoadSurveys } from '@/data/usecases'
import { throwError, makeMockSurveysModelList } from '@/tests/domain-tests/mocks'
import { LoadSurveysRepositorySpy } from '@/tests/data-tests/mocks'
import MockDate from 'mockdate'

type SutTypes = {
  sut: DbLoadSurveys
  loadSurveysRepositorySpy: LoadSurveysRepositorySpy
}
const makeSut = (): SutTypes => {
  const loadSurveysRepositorySpy = new LoadSurveysRepositorySpy()
  const sut = new DbLoadSurveys(loadSurveysRepositorySpy)
  return {
    sut,
    loadSurveysRepositorySpy
  }
}
describe('DbLoadSurveys', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })
  afterAll(() => {
    MockDate.reset()
  })
  test('Should call LoadSurveysRepository', async () => {
    const { sut, loadSurveysRepositorySpy } = makeSut()
    await sut.load()
    expect(loadSurveysRepositorySpy.callCount).toBe(1)
  })
  test('Should throw if loadSurveysRepository throws', async () => {
    const { sut, loadSurveysRepositorySpy } = makeSut()
    loadSurveysRepositorySpy.loadAll = throwError
    const surveysListPromise = sut.load()
    await expect(surveysListPromise).rejects.toThrow()
  })
  test('Should return a list of surveys on success', async () => {
    const { sut } = makeSut()
    const surveysList = await sut.load()
    expect(surveysList).toEqual(makeMockSurveysModelList())
  })
})
