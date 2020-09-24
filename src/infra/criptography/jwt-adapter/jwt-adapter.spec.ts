import { throwError } from '@/domain/test'
import jwt from 'jsonwebtoken'
import { JwtAdapter } from './jwt-adapter'

jest.mock('jsonwebtoken',() => ({
  sign (): string {
    return 'any_token'
  },
  verify (): string {
    return 'any_value'
  }
}))

const secretKey = 'secret'
const makeSut = (): JwtAdapter => {
  return new JwtAdapter(secretKey)
}
describe('Jwt Adapter', () => {
  describe('Sign - Encrypt',() => {
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
      jest.spyOn(jwt,'sign').mockImplementationOnce(throwError)
      const accessTokenPromise = sut.encrypt('any_id')
      await expect(accessTokenPromise).rejects.toThrow()
    })
  })
  describe('Verify - Decrypt',() => {
    test('Should call verify with correct values',async () => {
      const sut = makeSut()
      const verifySpy = jest.spyOn(jwt,'verify')
      await sut.decrypt('any_token')
      expect(verifySpy).toHaveBeenCalledWith('any_token','secret')
    })
    test('Should return a decrypted value on verify success',async () => {
      const sut = makeSut()
      const value = await sut.decrypt('any_token')
      expect(value).toBe('any_value')
    })
    test('Should throw if verify throws',async () => {
      const sut = makeSut()
      jest.spyOn(jwt,'verify').mockImplementationOnce(throwError)
      const responsePromise = sut.decrypt('any_token')
      await expect(responsePromise).rejects.toThrow()
    })
  })
})
