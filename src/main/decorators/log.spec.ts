import { LogControllerDecorator } from './log'
import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { serverError } from '../../presentation/helpers/http-helper'
import { LogErrorRepository } from '../../data/protocols/log-error-repository'

const makeControllerStub = (): Controller => {
  class ControllerStub implements Controller {
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
      const httpResponse: HttpResponse = {
        statusCode: 200,
        body: {
          name: 'Osmar'
        }
      }
      return httpResponse
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
describe('LogController Decorator', () => {
  test('Should call controller handle',async () => {
    const { controllerStub, sut } = makeSut()
    const handleSpy = jest.spyOn(controllerStub, 'handle')
    const httpRequest = {
      body: {
        name: 'Osmar'
      }
    }
    await sut.handle(httpRequest)
    expect(handleSpy).toHaveBeenCalledWith(httpRequest)
  })
  test('Should return the same value of the controller', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'Osmar'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual({
      statusCode: 200,
      body: {
        name: 'Osmar'
      }
    })
  })
  test('Should call LogErrorRepository with correct error if controller return a server error', async () => {
    const { sut,controllerStub,logErrorRepositoryStub } = makeSut()
    const errorMock = makeErrorMock()
    const serverErrorHttpResponse = serverError(errorMock)
    const logSpy = jest.spyOn(logErrorRepositoryStub,'log')
    jest.spyOn(controllerStub,'handle').mockReturnValueOnce(new Promise((resolve) => resolve(serverErrorHttpResponse)))
    const httpRequest = {
      body: {
        name: 'Osmar'
      }
    }
    await sut.handle(httpRequest)
    expect(logSpy).toHaveBeenCalledWith('any_stack')
  })
})
