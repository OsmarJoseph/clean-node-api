import { Controller } from '@/presentation/protocols'
import { LogMongoRepository } from '@/infra/db/mongodb/repositories/'
import { LogControllerDecorator } from '@/main/decorators'

export const makeLogControllerDecorator = (controller: Controller): Controller => {
  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(controller, logMongoRepository)
}
