
import { Message } from './Message'

export class UserMessage extends Message {

}


// TODO: Create smarter validator that checks if something is defined, then it's length.
export class CreateUser extends UserMessage {

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
}

export class FindUser extends UserMessage {
  id?: number
}

export class FindUsers extends UserMessage {
  limit?: number
  offset?: number
}
