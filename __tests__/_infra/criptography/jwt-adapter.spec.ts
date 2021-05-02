import { JwtAdapter } from '@/infra/criptography'
import { throwError } from '@/tests/_helpers'
import jwt from 'jsonwebtoken'
import faker from 'faker'

const verifyResponse = faker.random.word()
const signResponse = faker.random.uuid()

jest.mock('jsonwebtoken',() => ({
  sign (): string {
    return signResponse
  },
  verify (): string {
    return verifyResponse
  }
}))

const secretKey = faker.random.uuid()

const makeSut = (): JwtAdapter => {
  return new JwtAdapter(secretKey)
}
describe('Jwt Adapter', () => {
  let mockId = faker.random.uuid()
  let mockToken = faker.random.uuid()

  beforeEach(() => {
    mockId = faker.random.uuid()
    mockToken = faker.random.uuid()
  })
  describe('Sign - Encrypt',() => {
    test('Should call sign with correct values',async () => {
      const sut = makeSut()
      const signSpy = jest.spyOn(jwt,'sign')
      await sut.encrypt(mockId)
      expect(signSpy).toHaveBeenCalledWith({ id: mockId },secretKey)
    })
    test('Should call return a token on sign success',async () => {
      const sut = makeSut()
      const accessToken = await sut.encrypt(mockId)
      expect(accessToken).toBe(signResponse)
    })
    test('Should throw if sign throws',async () => {
      const sut = makeSut()
      jest.spyOn(jwt,'sign').mockImplementationOnce(throwError)
      const accessTokenPromise = sut.encrypt(mockId)
      await expect(accessTokenPromise).rejects.toThrow()
    })
  })
  describe('Verify - Decrypt',() => {
    test('Should call verify with correct values',async () => {
      const sut = makeSut()
      const verifySpy = jest.spyOn(jwt,'verify')
      await sut.decrypt(mockToken)
      expect(verifySpy).toHaveBeenCalledWith(mockToken,secretKey)
    })
    test('Should return a decrypted value on verify success',async () => {
      const sut = makeSut()
      const value = await sut.decrypt(mockToken)
      expect(value).toBe(verifyResponse)
    })
    test('Should throw if verify throws',async () => {
      const sut = makeSut()
      jest.spyOn(jwt,'verify').mockImplementationOnce(throwError)
      const responsePromise = sut.decrypt(mockToken)
      await expect(responsePromise).rejects.toThrow()
    })
  })
})
