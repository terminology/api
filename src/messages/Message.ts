import * as Validator from "class-validator";

export class Message {

  static Validator = Validator

  // Validate the message based on the decorated metadata.
  validate() {
    return Validator.validate(this)
  }
}
