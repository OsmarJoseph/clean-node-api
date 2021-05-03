import { BcryptAdapter } from '@/infra/criptography'
import { throwError } from '@/tests/_helpers'
import bcrypt from 'bcrypt'
import faker from 'faker'

const salt = 12
const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(salt)
}

const bcryptHash = faker.random.uuid()

jest.mock('bcrypt', () => ({
  async hash(): Promise<string> {
    return bcryptHash
  },
  async compare(): Promise<boolean> {
    return true
  },
}))

describe('Bcrypt Adapter', () => {
  let valueToBeHashed = faker.random.word()
  let hashValue = faker.random.uuid()
  beforeEach(() => {
    valueToBeHashed = faker.random.word()
    hashValue = faker.random.uuid()
  })

  describe('hash', () => {
    test('Should call hash with correct value', async () => {
      const sut = makeSut()
      const hashSpy = jest.spyOn(bcrypt, 'hash')
      await sut.hash(valueToBeHashed)
      expect(hashSpy).toHaveBeenCalledWith(valueToBeHashed, 12)
    })

    test('Should return a valid hash on hash success', async () => {
      const sut = makeSut()
      const hash = await sut.hash(valueToBeHashed)
      expect(hash).toBe(bcryptHash)
    })

    test('Should throw if hash throws', async () => {
      const sut = makeSut()
      jest.spyOn(bcrypt, 'hash').mockImplementationOnce(throwError)
      const hashPromise = sut.hash(valueToBeHashed)
      await expect(hashPromise).rejects.toThrow()
    })
  })
  describe('compare', () => {
    test('Should call compare with correct values', async () => {
      const sut = makeSut()
      const compareSpy = jest.spyOn(bcrypt, 'compare')
      await sut.compare(valueToBeHashed, hashValue)
      expect(compareSpy).toHaveBeenCalledWith(valueToBeHashed, hashValue)
    })
    test('Should return true when compare succeeds', async () => {
      const sut = makeSut()
      const isValid = await sut.compare(valueToBeHashed, hashValue)
      expect(isValid).toBe(true)
    })
    test('Should return false when compare fails', async () => {
      const sut = makeSut()
      jest.spyOn(bcrypt, 'compare').mockReturnValueOnce(Promise.resolve(false))
      const isValid = await sut.compare(valueToBeHashed, hashValue)
      expect(isValid).toBe(false)
    })
    test('Should throw if compare throws', async () => {
      const sut = makeSut()
      jest.spyOn(bcrypt, 'compare').mockImplementationOnce(throwError)
      const comparePromise = sut.compare(valueToBeHashed, hashValue)
      await expect(comparePromise).rejects.toThrow()
    })
  })
})
