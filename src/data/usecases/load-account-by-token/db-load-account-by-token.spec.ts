import { Decrypter } from '../../protocols/criptography/decrypter'
import { DbLoadAccountByToken } from './db-load-account-by-token'
interface SutTypes{
  sut: DbLoadAccountByToken
  decrypterStub: Decrypter
}
const makeDecrypter = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    async decrypt (value: string): Promise<string> {
      return 'any_value'
    }
  }
  return new DecrypterStub()
}

const makeSut = (): SutTypes => {
  const decrypterStub = makeDecrypter()
  const sut = new DbLoadAccountByToken(decrypterStub)
  return {
    sut,
    decrypterStub
  }
}
describe('Db LoadAccount By Token Usecase', () => {
  test('Should call decrypter with correct values', async () => {
    const { sut,decrypterStub } = makeSut()
    const decryptSpy = jest.spyOn(decrypterStub,'decrypt')
    await sut.loadByToken('any_token')
    expect(decryptSpy).toHaveBeenCalledWith('any_token')
  })
})
