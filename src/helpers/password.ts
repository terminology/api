
import * as bcrypt from 'bcrypt'

export async function hashPassword(plaintext, rounds): Promise<string> {
  return bcrypt.hash(plaintext, rounds)
}

export async function comparePassword(plaintext, hash): Promise<boolean> {
  return bcrypt.compare(plaintext, hash)
}
