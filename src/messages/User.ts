
import { Message, FindListMessage } from './Message'


// TODO: Create smarter validator that checks if something is defined, then it's length.
export class CreateUser extends Message {

  @Message.Validator.MinLength(1, {
    message: 'Name must be at least 1 characters.'
  })
  @Message.Validator.MaxLength(255, {
    message: 'Name cannot be more than 255 characters.'
  })
  name: string

  @Message.Validator.IsEmail(undefined, {
    message: 'Please enter a valid email address.'
  })
  @Message.Validator.MaxLength(255, {
    message: 'Email address cannot be more than 255 characters.'
  })
  email: string

  @Message.Validator.MinLength(8, {
    message: 'Password must be at least 8 characters.'
  })
  @Message.Validator.MaxLength(255, {
    message: 'Password cannot be more than 255 characters.'
  })
  password: string

  normalize() {
    this.email = this.email.toLowerCase()
    return this
  }
}

export class FindUser extends Message {

  @Message.Validator.IsInt({
    message: 'User ID must be defined.'
  })
  id: number

  @Message.Transformer.Expose({ groups: [ 'admin' ]})
  excludeDeleted: boolean = true

  @Message.Transformer.Expose({ groups: [ 'admin' ]})
  enabled: boolean = true

  normalize(): this {
    this.id = this.id * 1

    return super.normalize()
  }
}

export class FindUsers extends FindListMessage {

  @Message.Transformer.Expose({ groups: [ 'admin' ]})
  excludeDeleted: boolean = true

  @Message.Transformer.Expose({ groups: [ 'admin' ]})
  enabled: boolean = true

}
