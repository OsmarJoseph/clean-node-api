import { LogControllerDecorator } from '@/main/decorators'
import { Controller } from '@/presentation/protocols'
import { serverErrorRequest } from '@/presentation/helpers'
import { LogErrorRepositorySpy } from '@/tests/data-tests/mocks'
import { ControllerSpy, makeMockRequest, makeMockResponse } from '@/tests/main-tests/mocks'
import { makeErrorMock } from '@/tests/domain-tests/mocks'

type SutTypes = {
  sut: LogControllerDecorator
  controllerSpy: Controller
  logErrorRepositorySpy: LogErrorRepositorySpy
}
const makeSut = (): SutTypes => {
  const controllerSpy = new ControllerSpy()
  const logErrorRepositorySpy = new LogErrorRepositorySpy()
  const sut = new LogControllerDecorator(controllerSpy,logErrorRepositorySpy)
  return { controllerSpy, sut, logErrorRepositorySpy }
}

describe('LogController Decorator', () => {
  test('Should call controller handle',async () => {
    const { controllerSpy, sut } = makeSut()
    const handleSpy = jest.spyOn(controllerSpy, 'handle')
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
    const { sut,controllerSpy,logErrorRepositorySpy } = makeSut()
    jest.spyOn(controllerSpy,'handle').mockReturnValueOnce(Promise.resolve(serverErrorRequest(makeErrorMock())))
    await sut.handle(makeMockRequest())
    expect(logErrorRepositorySpy.errorStack).toBe('any_stack')
  })
})
