
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
    context.body = Controller.Transformer.serialize(body)
  }

  protected handleValidationErrors(errors: Validator.ValidationError[], ctx: Context) {
    console.log(errors)
    console.log('here?')
    ctx.throw(422, 'Nope', { foobar: 'Testing' })
    ctx.type = 'application/json'
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
