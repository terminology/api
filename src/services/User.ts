
import * as uuid from 'uuid'
import { User } from '../entities/User'
import { CreateUser, FindUser, FindUsers } from '../messages/User'
import { EntityService } from './Entity'
import { Context } from 'koa'
import { getConnection, EntityManager } from 'typeorm'
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

  /**
   * Find a user.
   *
   * @param message The user criteria.
   * @param context The application context.
   *
   * @return Promise<User>
   */
  async findUser(message: FindUser, context: Context): Promise<User | undefined> {
    return getConnection().transaction(async manager => this._findUser(manager, message, context))
  }

  /**
   * Delete a user.
   *
   * @param message The user criteria.
   * @param context The application context.
   *
   * @return Promise<User>
   */
  async deleteUser(message: FindUser, context: Context): Promise<User | undefined> {
    return getConnection().transaction(async manager => {

      // Find the user.
      let user = await this._findUser(manager, message, context)

      // Check if the user was found.
      if (!user) {
        return user;
      }

      // Update the user properties.
      user = manager.merge(User, user, { deletedAt: new Date(), deletedById: context.user.id })

      // Save the updated user.
      return await manager.save(User, user)
    })
  }

  /**
   * Find users.
   *
   * @param message The user criteria.
   * @param context The application context.
   *
   * @return Promise<User>
   */
  async findUsers(message: FindUsers, context: Context): Promise<User[]> {
    return getConnection().transaction(async manager => {

      // Find the users.
      return manager.find(User, {
        where: {},
        skip: message.offset,
        take: message.limit,
      })
    })
  }

  /**
   * Find a user.
   *
   * @param manager The entity manager.
   * @param message The user criteria.
   * @param context The application context.
   *
   * @return The user or undefined.
   */
  protected async _findUser(manager: EntityManager, message: FindUser, context: Context): Promise<User | undefined> {

    let query = manager
      .createQueryBuilder(User, 'user')
      .select()
      .where('user.id = :id', { id: message.id })
      .take(1)

    if (message.excludeDeleted) {
      query = query.andWhere('user.deletedAt IS NULL OR user.deletedAt > :now', { now: new Date() })
    }

    return query.getOne()
  }

  /**
   * Find users.
   *
   * @param manager The entity manager.
   * @param message The user criteria.
   * @param context The application context.
   *
   * @return The user or undefined.
   */
  protected async _findUsers(manager: EntityManager, message: FindUsers, context: Context): Promise<User[]> {

    let query = manager
      .createQueryBuilder(User, 'user')
      .select()

    if (message.excludeDeleted) {
      query = query.andWhere('user.deletedAt IS NULL OR user.deletedAt > :now', { now: new Date() })
    }

    return query.getMany()
  }
}

// export const userService = new UserService()
