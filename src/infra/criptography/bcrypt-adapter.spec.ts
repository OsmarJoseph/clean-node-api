import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

const salt = 12
const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(salt)
}

jest.mock('bcrypt',() => ({
  async hash (): Promise<string> {
    return 'mock_hash'
  }
}))

describe('Bcrypt Adapter',() => {
  test('Should call bcrypt with correct value', async () => {
    const sut = makeSut()
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.encrypt('any_value')
    expect(hashSpy).toHaveBeenCalledWith('any_value',12)
  })

  test('Should return a hash on success', async () => {
    const sut = makeSut()
    const hash = await sut.encrypt('any_value')
    expect(hash).toBe('mock_hash')
  })

  test('Should throw if bcrypt throws', async () => {
    const sut = makeSut()
    jest.spyOn(bcrypt,'hash').mockReturnValueOnce(new Promise((resolve,reject) => reject(new Error())))
    const hashPromise = sut.encrypt('any_value')
    await expect(hashPromise).rejects.toThrow()
  })
})