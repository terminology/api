
import { Context } from 'koa'
import { Controller } from './Controller'
import { UserService } from '../services/User'
import { CreateUser, FindUser, FindUsers } from '../messages/User'
import ModelHelper from '../helpers/Model'

export class UserController extends Controller {

  userService: UserService

  constructor() {
    super()
    this.userService = new UserService()
  }

  /**
   * Create a user.
   *
   * @param context Koa.Context The application context.
   */
  async createUser(context: Context) {

    // Validate request parameters.
    if (context.user) {
      context.throw(401, 'Cannot create a new user when logged in.')
    }

    // Marshall request body into message.
    let message = CreateUser.fromJSON<CreateUser>(context.request.body)

    // Validate the message.
    let errors = await message.normalize().validate()
    if (errors.length) {
      this.handleValidationErrors(errors, context)
    }

    // Create the user.
    let user = await this.userService.createUser(message, context)

    // Send the response.
    context.status = 201
    context.type = 'application/json'
    context.body = ModelHelper.Transformer.serialize(user)
  }

  async findUser(context: Context) {

    if (!context.user) {
      // context.throw(401, 'You must be signed in to perform that action.')
    }

    // Marshall request body into message.
    let message = FindUser.fromJSON<FindUser>({ id: context.params.userId })

    // Validate the message.
    let errors = await message.normalize().validate()
    if (errors.length) {
      this.handleValidationErrors(errors, context)
    }

    // Find the user.
    let user = await this.userService.findUser(message, context)

    if (!user) {
      context.throw(404, 'The requested user could not be found.')
    }

    // Send the response.
    context.status = 200
    context.type = 'application/json'
    context.body = ModelHelper.Transformer.serialize(user)
  }

  async findUsers(context: Context) {

    if (!context.user) {
      // context.throw(401, 'You must be signed in to perform that action.')
    }

    // Marshall request body into message.
    let message = FindUsers.fromJSON<FindUsers>(context.query)

    // Validate the message.
    let errors = await message.normalize().validate()
    if (errors.length) {
      this.handleValidationErrors(errors, context)
    }

    // Find the users.
    let users = await this.userService.findUsers(message, context)

    // Send the response.
    context.status = 200
    context.type = 'application/json'
    context.body = ModelHelper.Transformer.serialize(users)
  }

  _buildFindUsersParams(context: Context) {
    FindUsers.fromJSON<FindUsers>(context.query)
  }
}
