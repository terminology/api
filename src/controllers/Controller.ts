
import { Context } from 'koa'
import * as Validator from 'class-validator'
import * as Transformer from 'class-transformer'

/**
 * Base controller
 */
export class Controller {

  static Transformer = Transformer
  static Validator = Validator

  /**
   * Send a json encoded response to the context.
   *
   * @param context The application context.
   * @param status  The response status code.
   * @param body    The response body.
   *
   * @return void
   */
  protected json(context: Context, status: number = 200, body: any) {
    context.status = status || 200
    context.type = 'application/json'
    context.body = Controller.Transformer.classToPlain(body, this._buildEncodeTransformOptions(context, body))
  }

  /**
   * Handle validation errors.
   *
   * @param errors One or more validation errors.
   * @param ctx    The application context.
   */
  protected handleValidationErrors(errors: Validator.ValidationError[], ctx: Context) {

    // TODO: This should do something more useful with the error messages.
    ctx.throw(422, errors[0])
  }

  /**
   * Build the options for the class transformer when encoding response data.
   *
   * @param context The application context.
   *
   * @return The transform options.
   */
  protected _buildEncodeTransformOptions(context: Context, body: any): Transformer.ClassTransformOptions {
    return {
      groups: context.user ? [ context.user.role ] : [ 'contributor' ]
    }
  }

  /**
   * Validate the supplied object.
   *
   * @param options The object to validate.
   *
   * @return A promise returning zero or more validation errors.
   */
  protected async _validate(object: Object, options?: Validator.ValidationOptions): Promise<Validator.ValidationError[]> {

    // Initialize default options.
    if (!options) {
      options = {
        whitelist: true,
        forbidNonWhitelisted: true
      } as Validator.ValidatorOptions
    }

    // Validate the object.
    return Controller.Validator.validate(object, options)
  }
}
