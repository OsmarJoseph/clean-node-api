import { Hasher, HashComparer, Decrypter, Encrypter } from '@/data/protocols'
import faker from 'faker'

export class HasherSpy implements Hasher {
  digest = faker.random.uuid()
  plaintext: string

  async hash(plaintext: string): Promise<string> {
    this.plaintext = plaintext
    return this.digest
  }
}

export class HashComparerSpy implements HashComparer {
  plaintext: string
  digest: string
  isValid = true

  async compare(plaintext: string, digest: string): Promise<boolean> {
    this.plaintext = plaintext
    this.digest = digest
    return this.isValid
  }
}

export class DecrypterSpy implements Decrypter {
  plaintext = faker.internet.password()
  ciphertext: string

  async decrypt(ciphertext: string): Promise<string> {
    this.ciphertext = ciphertext
    return this.plaintext
  }
}

export class EncrypterSpy implements Encrypter {
  ciphertext = faker.random.uuid()
  plaintext: string

  async encrypt(plaintext: string): Promise<string> {
    this.plaintext = plaintext
    return this.ciphertext
  }
}
