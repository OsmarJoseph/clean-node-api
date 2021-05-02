import { DbCheckSurveyById } from '@/data/usecases'
import { throwError } from '@/tests/_helpers'
import { CheckSurveyByIdRepositorySpy } from '@/tests/_data/mocks'
import faker from 'faker'

type SutTypes = {
  sut: DbCheckSurveyById
  checkSurveyByIdRepositorySpy: CheckSurveyByIdRepositorySpy
}

const makeSut = (): SutTypes => {
  const checkSurveyByIdRepositorySpy = new CheckSurveyByIdRepositorySpy()
  const sut = new DbCheckSurveyById(checkSurveyByIdRepositorySpy)
  return {
    sut,
    checkSurveyByIdRepositorySpy
  }
}
describe('DbCheckSurveyById', () => {
  let mockId = faker.random.uuid()

  beforeEach(() => {
    mockId = faker.random.uuid()
  })

  test('Should call CheckSurveyByIdRepository with correct id', async () => {
    const { sut, checkSurveyByIdRepositorySpy } = makeSut()
    await sut.checkById(mockId)
    expect(checkSurveyByIdRepositorySpy.id).toBe(mockId)
  })
  test('Should throw if CheckSurveyByIdRepository throw', async () => {
    const { sut, checkSurveyByIdRepositorySpy } = makeSut()
    checkSurveyByIdRepositorySpy.checkById = throwError
    const checkByIdPromise = sut.checkById(mockId)
    await expect(checkByIdPromise).rejects.toThrow()
  })
  test('Should return false if CheckSurveyByIdRepository returns false', async () => {
    const { sut, checkSurveyByIdRepositorySpy } = makeSut()
    checkSurveyByIdRepositorySpy.result = false
    const existsSurvey = await sut.checkById(mockId)
    expect(existsSurvey).toBe(false)
  })
  test('Should return true on success', async () => {
    const { sut } = makeSut()
    const existsSurvey = await sut.checkById(mockId)
    expect(existsSurvey).toBe(true)
  })
})
