import * as bcrypt from 'bcrypt'
import * as lodash from 'lodash'
import * as jwt from 'jsonwebtoken'
const secret = process.env.JWT_SECRET_KEY

export async function hashPassword(plaintext: string, rounds: number = 10): Promise<string> {
  return bcrypt.hash(plaintext, rounds)
}

export async function comparePassword(plaintext: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plaintext, hash)
}

export function isTokenPayload(input: any): input is TokenPayload {
  return lodash.isPlainObject(input) &&
         lodash.isPlainObject(input.user) &&
         lodash.isNumber(input.user.id) &&
         lodash.isString(input.user.name)
}

export interface TokenPayload {
  user: {
    id: number
    name: string
  }
}

export async function verifyToken(token: string): Promise<TokenPayload> {
  return new Promise<TokenPayload>((resolve, reject) => {

    // Check if the secret key is available.
    if (!secret) {
      return reject(new Error('Application secret key not available'))
    }

    // Verify the token.
    jwt.verify(
      token,
      secret,
      {
        algorithms: [ 'HS256' ],
        ignoreExpiration: false,
        issuer: 'https://terminology.io'
      },
      (err: Error, decoded: any) => {

        // Check if the token could not be decoded.
        if (err) {
          return reject(err)
        }

        // Check if the token payload has the right structure.
        if (!isTokenPayload(decoded)) {
          return reject(new Error('Invalid authentication token payload.'))
        }

        // Resolve the token.
        return resolve(decoded)
      }
    )
  })
}

export async function signToken(payload: TokenPayload): Promise<string> {
  return new Promise<string>((resolve, reject) => {

    // Check if the secret key is available.
    if (!secret) {
      return reject(new Error('Application secret key not available'))
    }

    // Sign the token.
    jwt.sign(
      payload,
      secret,
      {
        algorithm: 'HS256',
        issuer: 'https://terminology.io',
        expiresIn: '7d'
      },
      (err: Error, token: string) => {
        if (err) {
          return reject(err)
        }

        return resolve(token)
      }
    )
  })
}
