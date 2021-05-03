export class ServerError extends Error {
  constructor(stack: string) {
    super('Internal server error, try again later')
    this.name = 'ServerError'
    this.stack = stack
  }
}
