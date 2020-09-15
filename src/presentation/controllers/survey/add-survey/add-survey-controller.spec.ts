import { HttpRequest, Validation, AddSurvey, AddSurveyModel } from './add-survey-protocols'
import { AddSurveyController } from './add-survey-controller'
import { badRequest, serverErrorResponse,noContentResponse } from '../../../helpers/http/http-helper'
const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error {
      return null
    }
  }
  return new ValidationStub()
}

const makeAddSurvey = (): AddSurvey => {
  class AddSurveyStub implements AddSurvey {
    async add (data: AddSurveyModel): Promise<void> {
      return null
    }
  }
  return new AddSurveyStub()
}
interface SutTypes {
  sut: AddSurveyController
  validationStub: Validation
  addSurveyStub: AddSurvey

}
const makeSut = (): SutTypes => {
  const validationStub = makeValidation()
  const addSurveyStub = makeAddSurvey()
  const sut = new AddSurveyController(validationStub,addSurveyStub)
  return {
    sut,
    validationStub,
    addSurveyStub
  }
}
const makeHttpRquest = (): HttpRequest => ({
  body: {
    question: 'any_question',
    possibleAnswers: [{
      image: 'any_image',
      answer: 'any_answer'
    }]
  }
})
describe('Add Survey Controller', () => {
  test('Should call validation with correct values', async () => {
    const { sut,validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub,'validate')
    const httpRequest = makeHttpRquest()
    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })
  test('Should return 400 if validation fails', async () => {
    const { sut,validationStub } = makeSut()
    jest.spyOn(validationStub,'validate').mockReturnValueOnce(new Error())
    const httpResponse = await sut.handle(makeHttpRquest())
    expect(httpResponse).toEqual(badRequest(new Error()))
  })
  test('Should call AddSurvey with correct values', async () => {
    const { sut,addSurveyStub } = makeSut()
    const addSpy = jest.spyOn(addSurveyStub,'add')
    const httpRequest = makeHttpRquest()
    await sut.handle(httpRequest)
    expect(addSpy).toHaveBeenCalledWith(httpRequest.body)
  })
  test('Should return 500 if AddSurvey throws', async () => {
    const { sut,addSurveyStub } = makeSut()
    jest.spyOn(addSurveyStub,'add').mockReturnValueOnce(new Promise((resolve,reject) => reject(new Error())))
    const httpResponse = await sut.handle(makeHttpRquest())
    expect(httpResponse).toEqual(serverErrorResponse(new Error()))
  })
  test('Should return 204 on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeHttpRquest())
    expect(httpResponse).toEqual(noContentResponse())
  })
})
