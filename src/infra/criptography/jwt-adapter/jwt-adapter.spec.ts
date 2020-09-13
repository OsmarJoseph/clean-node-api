import jwt from 'jsonwebtoken'
import { JwtAdapter } from './jwt-adapter'

jest.mock('jsonwebtoken',() => ({
  sign (): string {
    return 'any_token'
  }
}))

const secretKey = 'secret'
const makeSut = (): JwtAdapter => {
  return new JwtAdapter(secretKey)
}
describe('Jwt Adapter', () => {
  test('Should call sign with correct values',async () => {
    const sut = makeSut()
    const signSpy = jest.spyOn(jwt,'sign')
    await sut.encrypt('any_id')
    expect(signSpy).toHaveBeenCalledWith({ id: 'any_id' },'secret')
  })
  test('Should call return a token on sign success',async () => {
    const sut = makeSut()
    const accessToken = await sut.encrypt('any_id')
    expect(accessToken).toBe('any_token')
  })
  test('Should throw if sign throws',async () => {
    const sut = makeSut()
    jest.spyOn(jwt,'sign').mockImplementationOnce(() => { throw new Error() })
    const accessTokenPromise = sut.encrypt('any_id')
    await expect(accessTokenPromise).rejects.toThrow()
  })
})
