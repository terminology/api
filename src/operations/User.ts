import * as Validator from 'class-validator'
import * as Transformer from 'class-transformer'
import * as lodash from 'lodash'
import { Context } from 'koa'
import { Operation } from './Operation'
import * as ORM from 'typeorm'
import { User, UserState } from '../entities/User'
import { comparePassword, hashPassword } from '../helpers/User'
import * as uuid from 'uuid'

/**
 * Options for authenticating a user.
 */
export class AuthenticateUserOptions {

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
 * Options for creating a user.
 */
export class CreateUserOptions {

  @Validator.MinLength(1, {
    message: 'Name must be at least 1 characters.'
  })
  @Validator.MaxLength(255, {
    message: 'Name cannot be more than 255 characters.'
  })
  name: string

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

  @Validator.Equals(true, {
    message: 'You must agree to the Terms of Service.'
  })
  tos: boolean

  @Transformer.Expose({ groups: [ 'admin' ]})
  @Validator.ValidateIf(o => !!o.state)
  @Validator.IsEnum(UserState, {
    message: 'State must be "pending", "active", or "deleted".'
  })
  state?: UserState
}


/**
 * Options for confirming a user email address.
 */
export class ConfirmUserEmailOptions {

  @Validator.IsUUID("4", {
    message: 'Invalid confirmation token.'
  })
  token: string
}

/**
 * Options for finding a user.
 */
export class FindUserOptions implements ORM.FindOneOptions<User> {

  /**
   * Specifies what columns should be retrieved.
   */
  select?: (keyof User)[]

  /**
   * Simple condition that should be applied to match entities.
   */
  where?: ORM.FindConditions<User> | ORM.ObjectLiteral | string

  /**
   * Indicates what relations of entity should be loaded (simplified left join form).
   */
  relations?: string[]

  /**
   * Specifies what relations should be loaded.
   */
  join?: ORM.JoinOptions

  /**
   * Order, in which entities should be ordered.
   */
  order?: { [P in keyof User]?: "ASC" | "DESC" | 1 | -1 }

  /**
   * Enables or disables query result caching.
   */
  cache?: boolean | number | { id: any, milliseconds: number }

  /**
   * If sets to true then loads all relation ids of the entity and maps them into relation values (not relation objects).
   * If array of strings is given then loads only relation ids of the given properties.
   */
  loadRelationIds?: boolean | { relations?: string[], disableMixedMap?: boolean } // todo: extract options into separate interface, reuse

  /**
   * Indicates if eager relations should be loaded or not.
   * By default they are loaded when find methods are used.
   */
  loadEagerRelations?: boolean
}

/**
 * Options for finding a list of users.
 */
export class FindUsersOptions extends FindUserOptions implements ORM.FindManyOptions<User> {

  /**
   * Offset (paginated) where from entities should be taken.
   */
  @Validator.IsInt()
  @Transformer.Type(() => Number)
  skip?: number

  /**
   * Limit (paginated) - max number of entities should be taken.
   */
  @Validator.IsInt()
  @Validator.Min(1)
  @Validator.Max(100)
  @Transformer.Type(() => Number)
  take?: number
}

/**
 * Options for getting a user.
 */
export class GetUserOptions {

  @Validator.IsInt()
  @Transformer.Type(() => Number)
  id: number
}

/**
 * Options for getting a list of users.
 */
export class GetUsersOptions {
  ids: number[]
}

/**
 * Options for updating a user.
 */
export class UpdateUserOptions extends GetUserOptions {

  @Validator.ValidateIf(o => !!o.name)
  @Validator.MinLength(1, {
    message: 'Name must be at least 1 characters.'
  })
  @Validator.MaxLength(255, {
    message: 'Name cannot be more than 255 characters.'
  })
  name?: string

  @Validator.ValidateIf(o => !!o.email)
  @Validator.IsEmail(undefined, {
    message: 'Please enter a valid email address.'
  })
  @Validator.MaxLength(255, {
    message: 'Email address cannot be more than 255 characters.'
  })
  email?: string

  @Validator.ValidateIf(o => !!o.password)
  @Validator.MinLength(8, {
    message: 'Password must be at least 8 characters.'
  })
  @Validator.MaxLength(255, {
    message: 'Password cannot be more than 255 characters.'
  })
  @Transformer.Exclude({ toPlainOnly: true })
  password?: string

  @Transformer.Expose({ groups: [ 'admin' ]})
  @Validator.ValidateIf(o => !!o.state)
  @Validator.IsEnum(UserState, {
    message: 'State must be "pending", "active", or "deleted".'
  })
  state?: UserState
}

/**
 * Operations
 */

/**
 * Authenticate a user.
 */
export class AuthenticateUser extends Operation<AuthenticateUserOptions, User | undefined> {

  /**
   * Instantiate the operation.
   *
   * @param options The operation options.
   */
  constructor(options: AuthenticateUserOptions) {
    super(options, AuthenticateUserOptions)
  }

  /**
   * Authenticate a user.
   *
   * @param manager The entity manager.
   * @param context The application context.
   *
   * @return The authenticated user.
   */
  protected async _execute(manager: ORM.EntityManager, context: Context): Promise<User | undefined> {

    // Find the user.
    let user = await new FindUser({ where: { email: this.options.email } }).execute(manager, context)

    // Check if the user was found.
    if (!user || user.isDeleted()) {
      throw new Error('Invalid email address and password combination.')
    }
    // Check if the user is pending.
    else if (user.isPending()) {
      throw new Error('You must confirm your email address before you can sign in.')
    }

    // Compare the plain text password against the hash.
    let matches = await comparePassword(this.options.password, user.passwordHash)

    // Check if the password matches.
    if (!matches) {
      throw new Error('Invalid email address and password combination.')
    }

    // Update the user properties.
    user = manager.merge(User, user, { lastAuthenticatedAt: new Date() })

    // Save the updated user.
    return await manager.save(User, user)
  }
}

/**
 * Create a user.
 */
export class CreateUser extends Operation<CreateUserOptions, User> {

  /**
   * Instantiate the operation.
   *
   * @param options The operation options.
   */
  constructor(options: CreateUserOptions) {
    super(options, CreateUserOptions)
  }

  /**
   * Create a user.
   *
   * @param manager The entity manager.
   * @param context The application context.
   *
   * @return The created user.
   */
  protected async _execute(manager: ORM.EntityManager, context: Context): Promise<User> {

    // Hash the password.
    const passwordHash = await hashPassword(this.options.password, 10)

    // Create the user.
    const user = manager.create(User, {
      name: this.options.name,
      email: this.options.email.toLowerCase(),
      emailConfirmedAt: undefined,
      emailConfirmationToken: uuid.v4(),
      passwordHash: passwordHash,
      state: this.options.state || UserState.Pending,
      createdAt: new Date(),
      createdBy: context.user,
    })

    // Save the user.
    return manager.save(User, user)
  }
}

/**
 * Authenticate a user.
 */
export class ConfirmUserEmail extends Operation<ConfirmUserEmailOptions, User | undefined> {

  /**
   * Authenticate a user.
   *
   * @param manager The entity manager.
   * @param context The application context.
   *
   * @return The authenticated user.
   */
  protected async _execute(manager: ORM.EntityManager, context: Context): Promise<User | undefined> {

    // Find the user.
    let user = await new FindUser({ where: { emailConfirmationToken: this.options.token } }).execute(manager, context)

    // Check if the user was found.
    if (!user || user.isDeleted()) {
      throw new Error('Invalid confirmation token.')
    }
    // Check if the user is pending.
    else if (!user.isPending()) {
      return user
    }

    // Update the user properties.
    user = manager.merge(
      User,
      user,
      {
        state: UserState.Active,
        emailConfirmedAt: new Date(),
        emailConfirmationToken: '',
        lastUpdatedAt: new Date(),
        lastUpdatedBy: context.user
      }
    )

    // Save the updated user.
    return await manager.save(User, user)
  }
}

/**
 * Find a user.
 *
 * @param options The find options.
 */
export class FindUser extends Operation<FindUserOptions, User | undefined> {

  /**
   * Find a of user.
   *
   * @param manager The entity manager.
   * @param context The application context.
   *
   * @return The user.
   */
  protected async _execute(manager: ORM.EntityManager, context: Context): Promise<User | undefined> {
    return manager.findOne(User, this.options)
  }
}

/**
 * Find a list of users.
 *
 * @param options The find options.
 */
export class FindUsers extends Operation<FindUsersOptions, User[]> {

  /**
   * Find the list of users.
   *
   * @param manager The entity manager.
   * @param context The application context.
   *
   * @return The users.
   */
  protected async _execute(manager: ORM.EntityManager, context: Context): Promise<User[]> {
    return manager.find(User, this.options)
  }
}

/**
 * Get a user.
 */
export class GetUser extends Operation<GetUserOptions, User | undefined> {

  /**
   * Get a user.
   *
   * @param manager The entity manager.
   * @param context The application context.
   *
   * @return The user or undefined.
   */
  protected async _execute(manager: ORM.EntityManager, context: Context): Promise<User | undefined> {
    return manager.findOne(User, { where: { id: this.options.id }})
  }
}

/**
 * Get a list of users.
 */
export class GetUsers extends Operation<GetUsersOptions, User[]> {

  /**
   * Get a list of users.
   *
   * @param manager The entity manager.
   * @param context The application context.
   *
   * @return The list of users.
   */
  protected async _execute(manager: ORM.EntityManager, context: Context): Promise<User[]> {
    return manager.find(User, { where: { id: this.options.ids }})
  }
}

/**
 * Update a user.
 */
export class UpdateUser extends Operation<UpdateUserOptions, User | undefined> {

  /**
   * Instantiate the operation.
   *
   * @param options The operation options.
   */
  constructor(options: UpdateUserOptions) {
    super(options, UpdateUserOptions)
  }

  /**
   * Update a user.
   *
   * @param manager The entity manager.
   * @param context The application context.
   *
   * @return The updated user.
   */
  protected async _execute(manager: ORM.EntityManager, context: Context): Promise<User | undefined> {

    // Get the user.
    let user = await new GetUser(this.options).execute(manager, context)

    // Check if the user was found.
    if (!user) {
      return undefined
    }

    // Merge in the updated properties.
    user = manager.merge(
      User,
      user,
      {
        state: this.options.state || user.state,
        lastUpdatedAt: new Date(),
        lastUpdatedBy: context.user,
      }
    )

    // Save the user.
    return manager.save(User, user)
  }
}
