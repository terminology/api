
import { Context } from 'koa'
import { ValidationError } from 'class-validator'

export class Controller {

  protected handleValidationErrors(errors: ValidationError[], ctx: Context) {
    console.log(errors)
    console.log('here?')
    ctx.throw(422, 'Nope', { foobar: 'Testing' })
    ctx.type = 'application/json'
  }
}
