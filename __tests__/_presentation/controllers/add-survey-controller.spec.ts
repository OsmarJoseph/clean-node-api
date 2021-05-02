import { AddSurveyController } from '@/presentation/controllers'
import {
  badRequest,
  serverErrorRequest,
  noContentRequest
} from '@/presentation/helpers'
import { throwError } from '@/tests/_helpers'
import { ValidationSpy } from '@/tests/_validation/mocks'
import { AddSurveySpy } from '@/tests/_presentation/mocks'

import MockDate from 'mockdate'
import faker from 'faker'

type SutTypes = {
  sut: AddSurveyController
  validationSpy: ValidationSpy
  addSurveySpy: AddSurveySpy
}
const makeSut = (): SutTypes => {
  const validationSpy = new ValidationSpy()
  const addSurveySpy = new AddSurveySpy()
  const sut = new AddSurveyController(validationSpy, addSurveySpy)
  return {
    sut,
    validationSpy,
    addSurveySpy
  }
}

const mockRequest = (): AddSurveyController.Request => ({
  question: faker.random.words(),
  possibleAnswers: [
    {
      image: faker.image.imageUrl(),
      answer: faker.random.word()
    }
  ]
})

describe('Add Survey Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })
  afterAll(() => {
    MockDate.reset()
  })
  test('Should call validation with correct values', async () => {
    const { sut, validationSpy } = makeSut()
    const mockedRequest = mockRequest()
    await sut.handle(mockedRequest)
    expect(validationSpy.input).toEqual(mockedRequest)
  })
  test('Should return 400 if validation fails', async () => {
    const { sut, validationSpy } = makeSut()
    validationSpy.result = new Error()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(badRequest(new Error()))
  })
  test('Should call AddSurvey with correct values', async () => {
    const { sut, addSurveySpy } = makeSut()
    const mockedRequest = mockRequest()
    await sut.handle(mockedRequest)
    expect(addSurveySpy.data).toEqual({ ...mockedRequest, date: new Date() })
  })
  test('Should return 500 if AddSurvey throws', async () => {
    const { sut, addSurveySpy } = makeSut()
    addSurveySpy.add = throwError
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverErrorRequest(new Error()))
  })
  test('Should return 204 on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(noContentRequest())
  })
})
