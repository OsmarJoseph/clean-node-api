import { DbLoadAnswersBySurveyId } from '@/data/usecases'
import { throwError } from '@/tests/domain-tests/mocks'
import { LoadAnswersBySurveyIdRepositorySpy } from '@/tests/data-tests/mocks'
import faker from 'faker'

type SutTypes = {
  sut: DbLoadAnswersBySurveyId
  loadAnswersBySurveyIdRepositorySpy: LoadAnswersBySurveyIdRepositorySpy
}

const makeSut = (): SutTypes => {
  const loadAnswersBySurveyIdRepositorySpy = new LoadAnswersBySurveyIdRepositorySpy()
  const sut = new DbLoadAnswersBySurveyId(loadAnswersBySurveyIdRepositorySpy)
  return {
    sut,
    loadAnswersBySurveyIdRepositorySpy
  }
}
describe('DbLoadAnswersBySurveyId', () => {
  let mockId = faker.random.uuid()

  beforeEach(() => {
    mockId = faker.random.uuid()
  })

  test('Should call LoadAnswersBySurveyIdRepository with correct id', async () => {
    const { sut, loadAnswersBySurveyIdRepositorySpy } = makeSut()
    await sut.loadAnswers(mockId)
    expect(loadAnswersBySurveyIdRepositorySpy.id).toBe(mockId)
  })
  test('Should throw if LoadAnswersBySurveyIdRepository throw', async () => {
    const { sut, loadAnswersBySurveyIdRepositorySpy } = makeSut()
    loadAnswersBySurveyIdRepositorySpy.loadAnswers = throwError
    const loadAnswersPromise = sut.loadAnswers(mockId)
    await expect(loadAnswersPromise).rejects.toThrow()
  })
  test('Should return empty array if LoadAnswersBySurveyIdRepository fails', async () => {
    const { sut, loadAnswersBySurveyIdRepositorySpy } = makeSut()
    loadAnswersBySurveyIdRepositorySpy.result = []
    const answers = await sut.loadAnswers(mockId)
    expect(answers).toEqual([])
  })
  test('Should return answers on success', async () => {
    const { sut,loadAnswersBySurveyIdRepositorySpy } = makeSut()
    const answers = await sut.loadAnswers(mockId)
    expect(answers).toEqual(loadAnswersBySurveyIdRepositorySpy.result)
  })
})
