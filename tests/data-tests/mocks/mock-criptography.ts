import { Hasher , HashComparer , Decrypter , Encrypter } from '@/data/protocols'

export const makeMockHasher = (): Hasher => {
  class HasherStub implements Hasher {
    async hash (value: string): Promise<string> {
      return 'hashed_password'
    }
  }
  return new HasherStub()
}

export const makeMockHashComparer = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    async compare (value: string,hash: string): Promise<boolean> {
      return true
    }
  }
  return new HashComparerStub()
}

export const makeMockDecrypter = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    async decrypt (value: string): Promise<string> {
      return 'any_value'
    }
  }
  return new DecrypterStub()
}

export const makeMockEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return 'any_token'
    }
  }
  return new EncrypterStub()
}
