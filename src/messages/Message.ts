import * as Validator from "class-validator";
import * as Transformer from 'class-transformer'

export class Message {

  static Validator = Validator
  static Transformer = Transformer

  static fromJSON<T extends Message>(body: Object): T {
    return Transformer.plainToClassFromExist<T, object>(<T>new this(), body)
  }

  // Validate the message based on the decorated metadata.
  validate() {
    return Validator.validate(this)
  }

  // Normalize the message properties.
  normalize(): this {
    return this
  }
}

export class FindListMessage extends Message {
  limit?: number = 10
  offset: number = 0

  normalize(): this {
    this.limit = (this.limit && this.limit > 0) ? this.limit * 1 : undefined
    this.offset = (this.offset && this.offset > 0) ? this.offset * 1 : 0
    return super.normalize()
  }
}
