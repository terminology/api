
import { User } from '../entities/User'

export class Context {

  static background(): BackgroundContext {
    return new BackgroundContext();
  }

  static service(): ServiceContext {
    return new ServiceContext()
  }
}

export class BackgroundContext extends Context {}




export class ServiceContext extends Context {
  public readonly user?: User

  constructor(user?: User) {
    super()
    this.user = user
  }

  withUser(user: User): ServiceContext {
    return new ServiceContext(user)
  }
}
