import { DbLoadSurveyById } from '@/data/usecases'
import { throwError } from '@/tests/domain-tests/mocks'
import { LoadSurveyByIdRepositorySpy } from '@/tests/data-tests/mocks'
import MockDate from 'mockdate'
import faker from 'faker'

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
  let mockId = faker.random.uuid()

  beforeEach(() => {
    mockId = faker.random.uuid()
  })
  beforeAll(() => {
    MockDate.set(new Date())
  })
  afterAll(() => {
    MockDate.reset()
  })
  test('Should call LoadSurveyByIdRepository with correct id', async () => {
    const { sut, loadSurveyByIdRepositorySpy } = makeSut()
    await sut.loadById(mockId)
    expect(loadSurveyByIdRepositorySpy.id).toBe(mockId)
  })
  test('Should throw if LoadSurveyByIdRepository throw', async () => {
    const { sut, loadSurveyByIdRepositorySpy } = makeSut()
    loadSurveyByIdRepositorySpy.loadById = throwError
    const loadByIdPromise = sut.loadById(mockId)
    await expect(loadByIdPromise).rejects.toThrow()
  })
  test('Should return a survey on success', async () => {
    const { sut,loadSurveyByIdRepositorySpy } = makeSut()
    const survey = await sut.loadById(mockId)
    expect(survey).toEqual(loadSurveyByIdRepositorySpy.result)
  })
})
