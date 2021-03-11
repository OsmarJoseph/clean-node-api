import { LoadSurveys } from '@/domain/usecases'
import { LoadSurveysController } from '@/presentation/controllers'
import { okRequest, serverErrorRequest, noContentRequest } from '@/presentation/helpers'
import { throwError, makeMockSurveysModelList } from '@/tests/domain-tests/mocks'
import { makeMockLoadSurveys } from '@/tests/presentation-tests/mocks'
import MockDate from 'mockdate'

type SutTypes = {
  sut: LoadSurveysController
  loadSurveysStub: LoadSurveys
}
const makeSut = (): SutTypes => {
  const loadSurveysStub = makeMockLoadSurveys()
  const sut = new LoadSurveysController(loadSurveysStub)
  return {
    sut,
    loadSurveysStub
  }
}
describe('Load Suveys Controller',() => {
  beforeAll(() => {
    MockDate.set(new Date())
  })
  afterAll(() => {
    MockDate.reset()
  })
  test('Should call LoadSurveys', async () => {
    const { sut,loadSurveysStub } = makeSut()
    const loadSpy = jest.spyOn(loadSurveysStub,'load')
    await sut.handle({})
    expect(loadSpy).toHaveBeenCalled()
  })
  test('Should return 204 if LoadSurveys return empty', async () => {
    const { sut,loadSurveysStub } = makeSut()
    jest.spyOn(loadSurveysStub,'load').mockReturnValueOnce(Promise.resolve([]))
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(noContentRequest())
  })
  test('Should return 200 on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(okRequest(makeMockSurveysModelList()))
  })
  test('Should return 500 if LoadSurveys throws', async () => {
    const { sut,loadSurveysStub } = makeSut()
    jest.spyOn(loadSurveysStub,'load').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(serverErrorRequest(new Error()))
  })
})
