import { LogControllerDecorator } from '@/main/decorators'
import { serverErrorRequest } from '@/presentation/helpers'
import { LogErrorRepositorySpy } from '@/tests/data-tests/mocks'
import { ControllerSpy } from '@/tests/main-tests/mocks'
import { makeErrorMock } from '@/tests/domain-tests/mocks'

import faker from 'faker'

type SutTypes = {
  sut: LogControllerDecorator
  controllerSpy: ControllerSpy
  logErrorRepositorySpy: LogErrorRepositorySpy
}
const makeSut = (): SutTypes => {
  const controllerSpy = new ControllerSpy()
  const logErrorRepositorySpy = new LogErrorRepositorySpy()
  const sut = new LogControllerDecorator(controllerSpy, logErrorRepositorySpy)
  return { controllerSpy, sut, logErrorRepositorySpy }
}

describe('LogController Decorator', () => {
  test('Should call controller handle', async () => {
    const { controllerSpy, sut } = makeSut()

    const handleSpy = jest.spyOn(controllerSpy, 'handle')

    const request = faker.lorem.sentence()
    await sut.handle(request)
    expect(handleSpy).toHaveBeenCalledWith(request)
  })
  test('Should return the same value of the controller', async () => {
    const { sut, controllerSpy } = makeSut()
    const request = faker.lorem.sentence()
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(controllerSpy.result)
  })
  test('Should call LogErrorRepository with correct error if controller return a server error', async () => {
    const { sut, controllerSpy, logErrorRepositorySpy } = makeSut()
    const errorMock = makeErrorMock()
    controllerSpy.result = serverErrorRequest(errorMock)
    await sut.handle(faker.lorem.sentence())
    expect(logErrorRepositorySpy.errorStack).toBe(errorMock.stack)
  })
})
