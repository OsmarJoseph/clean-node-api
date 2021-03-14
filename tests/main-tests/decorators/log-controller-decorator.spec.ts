import { LogControllerDecorator } from '@/main/decorators'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { serverErrorRequest, okRequest } from '@/presentation/helpers'
import { LogErrorRepositorySpy } from '@/tests/data-tests/mocks'

const makeControllerStub = (): Controller => {
  class ControllerStub implements Controller {
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
      return makeMockResponse()
    }
  }
  return new ControllerStub()
}

type SutTypes = {
  sut: LogControllerDecorator
  controllerStub: Controller
  logErrorRepositorySpy: LogErrorRepositorySpy
}
const makeSut = (): SutTypes => {
  const controllerStub = makeControllerStub()
  const logErrorRepositorySpy = new LogErrorRepositorySpy()
  const sut = new LogControllerDecorator(controllerStub,logErrorRepositorySpy)
  return { controllerStub, sut, logErrorRepositorySpy }
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
  okRequest({
    any_field: 'any_value'
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
    const { sut,controllerStub,logErrorRepositorySpy } = makeSut()
    jest.spyOn(controllerStub,'handle').mockReturnValueOnce(Promise.resolve(serverErrorRequest(makeErrorMock())))
    await sut.handle(makeMockRequest())
    expect(logErrorRepositorySpy.errorStack).toBe('any_stack')
  })
})
