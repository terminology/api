import * as Transformer from 'class-transformer'
import * as lodash from 'lodash'
import { Context } from 'koa'
import { OperationController } from './Operation'
import { isUser } from '../entities/User'
import * as ORM from 'typeorm'
import * as Ops from '../operations/Token'

/**
 * Token controller.
 */
export class TokenController extends OperationController {

  /**
   * Create a token.
   *
   * @param context The application context.
   */
  public async create(context: Context) {

    // Build the options.
    let options = this._buildCreateTokenOptions(context)

    // Validate the options.
    let errors = await this._validate(options)
    if (errors.length) {
      return this.handleValidationErrors(errors, context)
    }

    // Perform the operation in a transaction.
    return ORM
      .getConnection()
      .transaction(async manager => {

        // Create the token.
        let token = await new Ops.CreateToken(options).execute(manager, context)

        // Send the response.
        return this.json(context, 201, { token })
      })
  }

  /**
   * Verify a token.
   *
   * @param context The application context.
   */
  public async verify(context: Context) {

    // Build the options.
    let options = this._buildVerifyTokenOptions(context)

    // Validate the options.
    let errors = await this._validate(options)
    if (errors.length) {
      return this.handleValidationErrors(errors, context)
    }

    // Perform the operation in a transaction.
    return ORM
      .getConnection()
      .transaction(async manager => {

        // Verify the token, receiving the user if verified.
        let user = await new Ops.VerifyToken(options).execute(manager, context)

        // Convert user to a plain object with the owner's properties.
        let plain = Transformer.classToPlain(user, { groups: [ 'owner' ]})

        // Send the response.
        return this.json(context, 200, plain)
      })
  }

  /**
   * Build the options to create a token.
   *
   * @param context The application context.
   *
   * @return The options to create a token.
   */
  protected _buildCreateTokenOptions(context: Context): Ops.CreateTokenOptions {
    return TokenController.Transformer.plainToClass<Ops.CreateTokenOptions, object>(
      Ops.CreateTokenOptions,
      context.request.body,
      this._buildDecodeTransformOptions(context)
    )
  }

  /**
   * Build the options to verify a token.
   *
   * @param context The application context.
   *
   * @return The options to verify a token.
   */
  protected _buildVerifyTokenOptions(context: Context): Ops.VerifyTokenOptions {
    return TokenController.Transformer.plainToClass<Ops.VerifyTokenOptions, object>(
      Ops.VerifyTokenOptions,
      context.request.body,
      this._buildDecodeTransformOptions(context)
    )
  }
}
