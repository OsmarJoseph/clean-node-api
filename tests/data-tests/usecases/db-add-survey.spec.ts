import { DbAddSurvey } from '@/data/usecases'
import { AddSurveyRepository } from '@/data/protocols'
import { throwError, makeAddSurveyParams } from '@/tests/domain-tests/mocks'
import { makeMockAddSurveyRepository } from '@/tests/data-tests/mocks'
import MockDate from 'mockdate'

type SutTypes = {
  sut: DbAddSurvey
  addSurveyRepository: AddSurveyRepository
}

const makeSut = (): SutTypes => {
  const addSurveyRepository = makeMockAddSurveyRepository()
  const sut = new DbAddSurvey(addSurveyRepository)
  return {
    sut,
    addSurveyRepository
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
    const { sut, addSurveyRepository } = makeSut()
    const addSpy = jest.spyOn(addSurveyRepository, 'add')
    const surveyParams = makeAddSurveyParams()
    await sut.add(surveyParams)
    expect(addSpy).toBeCalledWith(surveyParams)
  })
  test('Should throw if AddSurveyRepository throws', async () => {
    const { sut, addSurveyRepository } = makeSut()
    jest.spyOn(addSurveyRepository, 'add').mockImplementationOnce(throwError)
    const resultPromise = sut.add(makeAddSurveyParams())
    await expect(resultPromise).rejects.toThrow()
  })
})
