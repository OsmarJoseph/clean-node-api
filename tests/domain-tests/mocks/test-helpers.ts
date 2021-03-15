export const throwError = (): never => {
  throw new Error()
}

export const makeErrorMock = (): Error => {
  const error = new Error()
  error.stack = 'any_stack'
  return error
}
