
import { Context } from 'koa'
// import { Controller } from './Controller'
import { UserService } from '../services/User'
import { CreateUser, FindUser, FindUsers } from '../messages/User'
import * as Transformer from 'class-transformer'

export class UserController {

  userService: UserService

  constructor() {
    // super()
    this.userService = new UserService()
  }

  async createUser(ctx: Context) {

    // Validate request parameters.
    if (ctx.user) {
      ctx.throw(401, 'Cannot create a new user when logged in.')
    }
    // else if (validator.isEmpty(ctx.body.name)) {
    //   ctx.throw(422, 'Name is required.')
    // }
    // else if (validator.isEmpty(ctx.body.email)) {
    //   ctx.throw(422, 'Email is required.')
    // }
    // else if (validator.isEmpty(ctx.body.password)) {
    //   ctx.throw(422, 'Password is required.')
    // }
    // else if (validator.isEmpty(ctx.body.passwordConfirmation)) {
    //   ctx.throw(422, 'Password confirmation is required.')
    // }
    // else if (!validator.isEmail(ctx.body.email)) {
    //   ctx.throw(422, 'Email address is not valid.')
    // }
    // else if (!validator.equals(ctx.body.password, ctx.body.passwordConfirmation)) {
    //   ctx.throw(422, 'Password confirmation does not match.')
    // }
console.log(ctx.request.body)
    let message: CreateUser = Transformer.plainToClass(CreateUser, ctx.request.body as Object)
console.log(message)
    let errors = await message.validate()

    if (errors.length) {
      console.log(errors)
      ctx.throw(422, errors.map(error => error.constraints))
    }

    let user = await this.userService.createUser(message, ctx)

    ctx.status = 201
    ctx.body = user
  }
}
