import { LogControllerDecorator } from './log'
import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { serverError, success } from '../../presentation/helpers/http-helper'
import { LogErrorRepository } from '../../data/protocols/log-error-repository'

const makeControllerStub = (): Controller => {
  class ControllerStub implements Controller {
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
      return makeMockResponse()
    }
  }
  return new ControllerStub()
}

const makeLogErrorRepositoryStub = (): LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async log (errorStack: string): Promise<void> {
      return null
    }
  }
  return new LogErrorRepositoryStub()
}
interface SutTypes{
  sut: LogControllerDecorator
  controllerStub: Controller
  logErrorRepositoryStub: LogErrorRepository
}
const makeSut = (): SutTypes => {
  const controllerStub = makeControllerStub()
  const logErrorRepositoryStub = makeLogErrorRepositoryStub()
  const sut = new LogControllerDecorator(controllerStub,logErrorRepositoryStub)
  return { controllerStub, sut, logErrorRepositoryStub }
}

const makeErrorMock = (): Error => {
  const error = new Error()
  error.stack = 'any_stack'
  return error
}

const makeMockRequest = (): HttpRequest => ({
  body: {
    any_field: 'any_value'
  }
})

const makeMockResponse = (): HttpResponse =>
  success({
    body: {
      any_field: 'any_value'
    }
  })

describe('LogController Decorator', () => {
  test('Should call controller handle',async () => {
    const { controllerStub, sut } = makeSut()
    const handleSpy = jest.spyOn(controllerStub, 'handle')
    const httpRequest = makeMockRequest()
    await sut.handle(httpRequest)
    expect(handleSpy).toHaveBeenCalledWith(httpRequest)
  })
  test('Should return the same value of the controller', async () => {
    const { sut } = makeSut()
    const httpRequest = makeMockRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(makeMockResponse())
  })
  test('Should call LogErrorRepository with correct error if controller return a server error', async () => {
    const { sut,controllerStub,logErrorRepositoryStub } = makeSut()
    const logSpy = jest.spyOn(logErrorRepositoryStub,'log')
    jest.spyOn(controllerStub,'handle').mockReturnValueOnce(new Promise((resolve) => resolve(serverError(makeErrorMock()))))
    await sut.handle(makeMockRequest())
    expect(logSpy).toHaveBeenCalledWith('any_stack')
  })
})
