import * as Transformer from 'class-transformer'
import * as lodash from 'lodash'
import { Context } from 'koa'
import { OperationController } from './Operation'
import * as ORM from 'typeorm'
import { User, isUser } from '../entities/User'
import * as Ops from '../operations/User'

/**
 * User controller.
 */
export class UserController extends OperationController {

  /**
   * Create a user.
   *
   * @param context The application context.
   */
  public async create(context: Context) {

    // Build the options.
    let options = this._buildCreateUserOptions(context)

    // Validate the options.
    let errors = await this._validate(options)
    if (errors.length) {
      return this.handleValidationErrors(errors, context)
    }

    // Perform the operation in a transaction.
    return ORM
      .getConnection()
      .transaction(async manager => {

        // Create the user.
        let created = await new Ops.CreateUser(options).execute(manager, context)

        // Send the response.
        return this.json(context, 201, created)
      })
  }

  /**
   * Confirm a user email address.
   *
   * @param context The application context.
   */
  public async confirmEmail(context: Context) {

    // Build the options.
    let options = this._buildConfirmUserEmailOptions(context)

    // Validate the options.
    let errors = await this._validate(options)
    if (errors.length) {
      return this.handleValidationErrors(errors, context)
    }

    // Perform the operation in a transaction.
    return ORM
      .getConnection()
      .transaction(async manager => {

        // Get the user.
        let user = await new Ops.ConfirmUserEmail(options).execute(manager, context)

        // Check if the user was found.
        if (!user) {
          context.throw(404, new Error('The requested user could not be found.'))
        }

        // Send the response.
        return this.json(context, 200, user)
      })
  }

  /**
   * Find users.
   *
   * @param context The application context.
   */
  public async find(context: Context) {

    // Build the options.
    let options = this._buildFindUsersOptions(context)

    // Validate the options.
    let errors = await this._validate(options)
    if (errors.length) {
      return this.handleValidationErrors(errors, context)
    }

    // Perform the operation in a transaction.
    return ORM
      .getConnection()
      .transaction(async manager => {

        // Find the user.
        let users = await new Ops.FindUsers(options).execute(manager, context)

        // Send the response.
        return this.json(context, 200, users)
      })
  }

  /**
   * Get a user.
   *
   * @param context The application context.
   */
  public async get(context: Context) {

    // Build the options.
    let options = this._buildGetUserOptions(context)

    // Validate the options.
    let errors = await this._validate(options)
    if (errors.length) {
      return this.handleValidationErrors(errors, context)
    }

    // Perform the operation in a transaction.
    return ORM
      .getConnection()
      .transaction(async manager => {

        // Get the user.
        let user = await new Ops.GetUser(options).execute(manager, context)

        // Check if the user was found.
        if (!user) {
          context.throw(404, new Error('The requested user could not be found.'))
        }

        // Send the response.
        return this.json(context, 200, user)
      })
  }

  /**
   * Update a user.
   *
   * @param context The application context.
   */
  public async update(context: Context) {

    // Build the options.
    let options = this._buildUpdateUserOptions(context)

    // Validate the options.
    let errors = await this._validate(options)
    if (errors.length) {
      return this.handleValidationErrors(errors, context)
    }

    // Perform the operation in a transaction.
    return ORM
      .getConnection()
      .transaction(async manager => {

        // Get the user.
        let user = await new Ops.UpdateUser(options).execute(manager, context)

        // Check if the user was found.
        if (!user) {
          context.throw(404, new Error('The requested user could not be found.'))
        }

        // Send the response.
        return this.json(context, 200, user)
      })
  }

  /**
   * Build the options to create a user.
   *
   * @param context The application context.
   *
   * @return The options to create a user.
   */
  protected _buildCreateUserOptions(context: Context): Ops.CreateUserOptions {
    return UserController.Transformer.plainToClass<Ops.CreateUserOptions, object>(
      Ops.CreateUserOptions,
      context.request.body,
      this._buildDecodeTransformOptions(context)
    )
  }

  /**
   * Build the options to confirm a user email address.
   *
   * @param context The application context.
   *
   * @return The options to confirm a user email address.
   */
  protected _buildConfirmUserEmailOptions(context: Context): Ops.ConfirmUserEmailOptions {
    return UserController.Transformer.plainToClass<Ops.ConfirmUserEmailOptions, object>(
      Ops.ConfirmUserEmailOptions,
      {
        token: context.params.token
      },
      this._buildDecodeTransformOptions(context)
    )
  }

  /**
   * Build the options to get a user.
   *
   * @param context The application context.
   *
   * @return The options to get a user.
   */
  protected _buildGetUserOptions(context: Context): Ops.GetUserOptions {

    // Get the relations to populate.
    const relations = context.query.relations ? context.query.relations.split(/,/g) : []

    return UserController.Transformer.plainToClass<Ops.GetUserOptions, object>(
      Ops.GetUserOptions,
      {
        id: context.params.userId,
        relations: relations,
      },
      this._buildDecodeTransformOptions(context)
    )
  }

  /**
   * Build the options to find a list of users.
   *
   * @param context The application context.
   *
   * @return The options to find a list of users.
   */
  protected _buildFindUsersOptions(context: Context): Ops.FindUsersOptions {

    // Get the relations to populate.
    const relations = context.query.relations ? context.query.relations.split(/,/g) : []

    return UserController.Transformer.plainToClass<Ops.FindUsersOptions, object>(
      Ops.FindUsersOptions,
      {
        skip: context.query.skip || 0,
        take: context.query.take || 10,
        relations: relations,
      },
      this._buildDecodeTransformOptions(context)
    )
  }

  /**
   * Build the options to update a user.
   *
   * @param context The application context.
   *
   * @return The options to update a user.
   */
  protected _buildUpdateUserOptions(context: Context): Ops.UpdateUserOptions {
    return UserController.Transformer.plainToClass<Ops.UpdateUserOptions, object>(
      Ops.UpdateUserOptions,
      Object.assign(
        {},
        context.request.body,
        { id: context.params.userId }
      ),
      this._buildDecodeTransformOptions(context)
    )
  }

  /**
   * Build the options for the class transformer when decoding request data.
   *
   * @param context The application context.
   *
   * @return The transform options.
   */
  protected _buildDecodeTransformOptions(context: Context): Transformer.ClassTransformOptions {
    return {
      groups: context.user ? [ context.user.role ] : [ 'contributor' ]
    }
  }

  /**
   * Build the options for the class transformer when encoding response data.
   *
   * @param context The application context.
   *
   * @return The transform options.
   */
  protected _buildEncodeTransformOptions(context: Context, body: any): Transformer.ClassTransformOptions {

    // Initialize the basic groups.
    let groups = context.user ? [ context.user.role ] : [ 'contributor' ]

    // Check if the current user is the user being accessed.
    if (isUser(body) && context.user && body.id === context.user.id) {
      groups.push('owner')
    }

    return {
      groups: groups
    }
  }
}
