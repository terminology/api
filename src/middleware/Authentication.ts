import { Context } from 'koa'
import * as ORM from 'typeorm'
import * as Ops from '../operations/User'

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
          let user = await new Ops.AuthenticateUser({ email: email, password: password }).execute(manager, context)

          if (!user) {
            context.throw(401, 'Invalid email address and password.')
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

  return next()
}
