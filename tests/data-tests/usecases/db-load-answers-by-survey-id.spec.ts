import { DbLoadAnswersBySurveyId } from '@/data/usecases'
import { throwError } from '@/tests/domain-tests/mocks'
import { LoadSurveyByIdRepositorySpy } from '@/tests/data-tests/mocks'
import faker from 'faker'

type SutTypes = {
  sut: DbLoadAnswersBySurveyId
  loadSurveyByIdRepositorySpy: LoadSurveyByIdRepositorySpy
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdRepositorySpy = new LoadSurveyByIdRepositorySpy()
  const sut = new DbLoadAnswersBySurveyId(loadSurveyByIdRepositorySpy)
  return {
    sut,
    loadSurveyByIdRepositorySpy
  }
}
describe('DbLoadAnswersBySurveyId', () => {
  let mockId = faker.random.uuid()

  beforeEach(() => {
    mockId = faker.random.uuid()
  })

  test('Should call LoadSurveyByIdRepository with correct id', async () => {
    const { sut, loadSurveyByIdRepositorySpy } = makeSut()
    await sut.loadAnswers(mockId)
    expect(loadSurveyByIdRepositorySpy.id).toBe(mockId)
  })
  test('Should throw if LoadSurveyByIdRepository throw', async () => {
    const { sut, loadSurveyByIdRepositorySpy } = makeSut()
    loadSurveyByIdRepositorySpy.loadById = throwError
    const loadAnswersPromise = sut.loadAnswers(mockId)
    await expect(loadAnswersPromise).rejects.toThrow()
  })
  test('Should return empty array if LoadSurveyByIdRepository returns null', async () => {
    const { sut, loadSurveyByIdRepositorySpy } = makeSut()
    loadSurveyByIdRepositorySpy.result = null
    const answers = await sut.loadAnswers(mockId)
    expect(answers).toEqual([])
  })
  test('Should return answers on success', async () => {
    const { sut,loadSurveyByIdRepositorySpy } = makeSut()
    const answers = await sut.loadAnswers(mockId)
    expect(answers).toEqual(loadSurveyByIdRepositorySpy.result.possibleAnswers.map(({ answer }) => answer))
  })
})
