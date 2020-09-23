import { DbAddSurvey } from './db-add-survey'
import { AddSurveyRepository } from './db-add-survey-protocols'
import { throwError, makeAddSurveyParams } from '@/domain/test'
import { makeMockAddSurveyRepository } from '@/data/test'
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
    const { sut,addSurveyRepository } = makeSut()
    const addSpy = jest.spyOn(addSurveyRepository,'add')
    const surveyParams = makeAddSurveyParams()
    await sut.add(surveyParams)
    expect(addSpy).toBeCalledWith(surveyParams)
  })
  test('Should throw if AddSurveyRepository throws', async () => {
    const { sut,addSurveyRepository } = makeSut()
    jest.spyOn(addSurveyRepository,'add').mockImplementationOnce(throwError)
    const resultPromise = sut.add(makeAddSurveyParams())
    await expect(resultPromise).rejects.toThrow()
  })
})
