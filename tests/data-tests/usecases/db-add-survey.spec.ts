import { DbAddSurvey } from '@/data/usecases'
import { mockAddSurveyParams } from '@/tests/domain-tests/mocks'
import { AddSurveyRepositorySpy } from '@/tests/data-tests/mocks'
import { throwError } from '@/tests/helpers'
import MockDate from 'mockdate'

type SutTypes = {
  sut: DbAddSurvey
  addSurveyRepositorySpy: AddSurveyRepositorySpy
}

const makeSut = (): SutTypes => {
  const addSurveyRepositorySpy = new AddSurveyRepositorySpy()
  const sut = new DbAddSurvey(addSurveyRepositorySpy)
  return {
    sut,
    addSurveyRepositorySpy
  }
}
describe('DbAddSurvey Usecase', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })
  afterAll(() => {
    MockDate.reset()
  })
  test('Should call AddSurveyRepository with correct values', async () => {
    const { sut, addSurveyRepositorySpy } = makeSut()
    const surveyParams = mockAddSurveyParams()
    await sut.add(surveyParams)
    expect(addSurveyRepositorySpy.surveyParams).toBe(surveyParams)
  })
  test('Should throw if AddSurveyRepository throws', async () => {
    const { sut, addSurveyRepositorySpy } = makeSut()
    addSurveyRepositorySpy.add = throwError
    const resultPromise = sut.add(mockAddSurveyParams())
    await expect(resultPromise).rejects.toThrow()
  })
})
