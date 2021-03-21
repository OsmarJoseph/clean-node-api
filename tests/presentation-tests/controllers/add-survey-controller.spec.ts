import { AddSurveyController } from '@/presentation/controllers'
import { HttpRequest } from '@/presentation/protocols'
import { badRequest, serverErrorRequest,noContentRequest } from '@/presentation/helpers'
import { throwError, mockAddSurveyParams } from '@/tests/domain-tests/mocks'
import { ValidationSpy } from '@/tests/validation-tests/mocks'
import { AddSurveySpy } from '@/tests/presentation-tests/mocks'

import MockDate from 'mockdate'

type SutTypes = {
  sut: AddSurveyController
  validationSpy: ValidationSpy
  addSurveySpy: AddSurveySpy

}
const makeSut = (): SutTypes => {
  const validationSpy = new ValidationSpy()
  const addSurveySpy = new AddSurveySpy()
  const sut = new AddSurveyController(validationSpy,addSurveySpy)
  return {
    sut,
    validationSpy,
    addSurveySpy
  }
}
const makeHttpRquest = (): HttpRequest => ({
  body: {
    ...mockAddSurveyParams()
  }
})
describe('Add Survey Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })
  afterAll(() => {
    MockDate.reset()
  })
  test('Should call validation with correct values', async () => {
    const { sut,validationSpy } = makeSut()
    const httpRequest = makeHttpRquest()
    await sut.handle(httpRequest)
    expect(validationSpy.input).toEqual(httpRequest.body)
  })
  test('Should return 400 if validation fails', async () => {
    const { sut,validationSpy } = makeSut()
    validationSpy.result = new Error()
    const httpResponse = await sut.handle(makeHttpRquest())
    expect(httpResponse).toEqual(badRequest(new Error()))
  })
  test('Should call AddSurvey with correct values', async () => {
    const { sut,addSurveySpy } = makeSut()
    const httpRequest = makeHttpRquest()
    await sut.handle(httpRequest)
    httpRequest.body.date = new Date()
    expect(addSurveySpy.data).toEqual(httpRequest.body)
  })
  test('Should return 500 if AddSurvey throws', async () => {
    const { sut,addSurveySpy } = makeSut()
    addSurveySpy.add = throwError
    const httpResponse = await sut.handle(makeHttpRquest())
    expect(httpResponse).toEqual(serverErrorRequest(new Error()))
  })
  test('Should return 204 on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeHttpRquest())
    expect(httpResponse).toEqual(noContentRequest())
  })
})
