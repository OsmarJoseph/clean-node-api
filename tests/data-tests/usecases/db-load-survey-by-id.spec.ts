import { DbLoadSurveyById } from '@/data/usecases'
import { throwError, makeMockSurveyModel } from '@/tests/domain-tests/mocks'
import { LoadSurveyByIdRepositorySpy } from '@/tests/data-tests/mocks'
import MockDate from 'mockdate'

type SutTypes = {
  sut: DbLoadSurveyById
  loadSurveyByIdRepositorySpy: LoadSurveyByIdRepositorySpy
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdRepositorySpy = new LoadSurveyByIdRepositorySpy()
  const sut = new DbLoadSurveyById(loadSurveyByIdRepositorySpy)
  return {
    sut,
    loadSurveyByIdRepositorySpy
  }
}
describe('DbLoadSurveyById', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })
  afterAll(() => {
    MockDate.reset()
  })
  test('Should call LoadSurveyByIdRepository with correct id', async () => {
    const { sut, loadSurveyByIdRepositorySpy } = makeSut()
    await sut.loadById('any_id')
    expect(loadSurveyByIdRepositorySpy.id).toBe('any_id')
  })
  test('Should throw if LoadSurveyByIdRepository throw', async () => {
    const { sut, loadSurveyByIdRepositorySpy } = makeSut()
    loadSurveyByIdRepositorySpy.loadById = throwError
    const loadByIdPromise = sut.loadById('any_id')
    await expect(loadByIdPromise).rejects.toThrow()
  })
  test('Should return a survey on success', async () => {
    const { sut } = makeSut()
    const survey = await sut.loadById('any_id')
    expect(survey).toEqual(makeMockSurveyModel())
  })
})
