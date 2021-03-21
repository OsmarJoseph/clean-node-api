import { LoadSurveysController } from '@/presentation/controllers'
import { okRequest, serverErrorRequest, noContentRequest } from '@/presentation/helpers'
import { throwError } from '@/tests/domain-tests/mocks'
import { LoadSurveysSpy } from '@/tests/presentation-tests/mocks'
import MockDate from 'mockdate'

type SutTypes = {
  sut: LoadSurveysController
  loadSurveysSpy: LoadSurveysSpy
}
const makeSut = (): SutTypes => {
  const loadSurveysSpy = new LoadSurveysSpy()
  const sut = new LoadSurveysController(loadSurveysSpy)
  return {
    sut,
    loadSurveysSpy
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
    const { sut,loadSurveysSpy } = makeSut()
    await sut.handle({})
    expect(loadSurveysSpy.callCount).toBe(1)
  })
  test('Should return 204 if LoadSurveys return empty', async () => {
    const { sut,loadSurveysSpy } = makeSut()
    loadSurveysSpy.result = []
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(noContentRequest())
  })
  test('Should return 200 on success', async () => {
    const { sut,loadSurveysSpy } = makeSut()
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(okRequest(loadSurveysSpy.result))
  })
  test('Should return 500 if LoadSurveys throws', async () => {
    const { sut,loadSurveysSpy } = makeSut()
    loadSurveysSpy.load = throwError
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(serverErrorRequest(new Error()))
  })
})
