import faker from 'faker'

export const throwError = (): never => {
  throw new Error()
}

export const makeErrorMock = (): Error => {
  const error = new Error()
  error.stack = faker.random.words()
  return error
}
