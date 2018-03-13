
import * as uuid from 'uuid'
import { User } from '../entities/User'
import { CreateUser, FindUser } from '../messages/User'
import { EntityService } from './Entity'
import { Context } from 'koa'
import { getConnection } from 'typeorm'
import { hashPassword } from '../helpers/password'

export class UserService extends EntityService<User> {

  constructor() {
    super(User)
  }

  async createUser(message: CreateUser, context: Context): Promise<User> {
    return getConnection().transaction(async manager => {

      // TODO: can be done concurrently with checking whether the user's email address is unique.
      const passwordHash = await hashPassword(message.password, 10)

      // Build the user.
      const user = manager.create(
        User,
        {
          name: message.name,
          email: message.email,
          emailConfirmed: false,
          emailConfirmedAt: undefined,
          emailConfirmationToken: uuid.v4(),
          passwordHash: passwordHash,
          enabled: false,
          createdAt: new Date(),
        }
      )

      // Save the user.
      return manager.save(User, user)
    })
  }

  async findUser(message: FindUser, context: Context): Promise<User> {
    return this._promise((resolve, reject) => {
      return resolve(new User())
    })
  }
}

// export const userService = new UserService()
