import * as Validator from 'class-validator'
import * as Transformer from 'class-transformer'
import * as lodash from 'lodash'
import { Context } from 'koa'
import { Operation } from './Operation'
import * as ORM from 'typeorm'
import { signToken, verifyToken, TokenPayload } from '../helpers/User'
import { User } from '../entities/User'
import * as UOps from './User'

/**
 * Options for verifying a token.
 */
export class VerifyTokenOptions {

  @Validator.Allow()
  token: string
}

/**
 * Options for creating a token.
 */
export class CreateTokenOptions {

  @Validator.IsEmail(undefined, {
    message: 'Please enter a valid email address.'
  })
  @Validator.MaxLength(255, {
    message: 'Email address cannot be more than 255 characters.'
  })
  email: string

  @Validator.MinLength(8, {
    message: 'Password must be at least 8 characters.'
  })
  @Validator.MaxLength(255, {
    message: 'Password cannot be more than 255 characters.'
  })
  @Transformer.Exclude({ toPlainOnly: true })
  password: string
}

/**
 * Operations
 */

/**
 * Verify a token.
 */
export class VerifyToken extends Operation<VerifyTokenOptions, User | undefined> {

  /**
   * Instantiate the operation.
   *
   * @param options The operation options.
   */
  constructor(options: VerifyTokenOptions) {
    super(options, VerifyTokenOptions)
  }

  /**
   * Verify a token.
   *
   * @param manager The entity manager.
   * @param context The application context.
   *
   * @return The authenticated user.
   */
  protected async _execute(manager: ORM.EntityManager, context: Context): Promise<User | undefined> {

    // First, verify the token.
    let payload: TokenPayload = await verifyToken(this.options.token)

    // Get the user.
    let user = await new UOps.GetUser({ id: payload.user.id }).execute(manager, context)

    // Check if the user was found.
    if (!user || user.isDeleted()) {
      throw new Error('The token is authorized but the user was not found.')
    }
    // Check if the user is pending.
    else if (user.isPending()) {
      throw new Error('You must confirm your email address before you can sign in.')
    }

    return user
  }
}

/**
 * Create a token.
 */
export class CreateToken extends Operation<CreateTokenOptions, string> {

  /**
   * Instantiate the operation.
   *
   * @param options The operation options.
   */
  constructor(options: CreateTokenOptions) {
    super(options, CreateTokenOptions)
  }

  /**
   * Create a token.
   *
   * @param manager The entity manager.
   * @param context The application context.
   *
   * @return The created user.
   */
  protected async _execute(manager: ORM.EntityManager, context: Context): Promise<string> {

    // Autheticate the user.
    let user = await new UOps.AuthenticateUser(this.options).execute(manager, context)

    // Check if the user was authenticated.
    if (!user) {
      throw new Error('Invalid email address and password combination.')
    }

    // Create the token payload.
    const payload: TokenPayload = {
      user: {
        id: user.id,
        name: user.name
      }
    }

    // Sign the token.
    return signToken(payload)
  }
}
