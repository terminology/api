import { Context } from 'koa'
import * as ORM from 'typeorm'
import * as UOps from '../operations/User'
import * as TOps from '../operations/Token'

export async function AuthenticationMiddleware(context: Context, next: Function) {

  // Check if an authorization header was provided.
  if (!context.headers || !context.headers.authorization) {
    return next()
  }

  let header = context.headers.authorization
  let [ kind, value ] = header.split(' ', 2)

  // Check if basic auth is being used.
  if (kind === 'Basic' && value) {

    let encoded = new Buffer(value, 'base64')
    let [ email, password ] = encoded.toString('utf8').split(':', 2)

    try {
      // Authenticate the user in a transaction.
      let user = await ORM
        .getConnection()
        .transaction(async manager => {

          // Autheticate the user.
          let user = await new UOps.AuthenticateUser({ email: email, password: password }).execute(manager, context)

          if (!user) {
            context.throw(401, new Error('Invalid email address and password.'))
          }

          return user
        })

      // Add the user to the request context.
      context.user = user
      return next()
    }
    catch (e) {
      context.throw(401, e)
    }
  }
  // Check if JWT auth is being used.
  else if (kind === 'Bearer' && value) {

    try {
      // Authenticate the user in a transaction.
      let user = await ORM
        .getConnection()
        .transaction(async manager => {

          // Verify the token.
          let user = await new TOps.VerifyToken({ token: value }).execute(manager, context)

          // Check if the user was found.
          if (!user) {
            context.throw(401, new Error('Invalid authentication token.'))
          }

          return user
        })

      // Add the user to the request context.
      context.user = user
      return next()
    }
    catch (e) {
      // Check if the token has expired.
      if (e.name === 'TokenExpiredError') {
        context.throw(401, new Error('Your session has expired. Please sign in again.'))
      }

      // Throw an invalid token error.
      context.throw(401, new Error('Invalid authentication token. Please sign in again.'))
    }

  }

  return next()
}
