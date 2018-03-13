
import { Service } from './Service'

export class EntityService<E> extends Service {
  type: { new(): E }
  constructor(type: { new(): E }) {
    super()
    this.type = type
  }

  _promise(fn: (resolve, reject) => any): Promise<E> {
    return new Promise<E>(fn)
  }
}
