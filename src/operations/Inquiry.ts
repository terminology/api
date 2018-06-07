import * as Validator from 'class-validator'
import * as ORM from 'typeorm'
import * as COps from './Content'
import { Context } from 'koa'
import { Content, ContentState } from '../entities/Content'
import { Inquiry } from '../entities/Inquiry'

export class CreateInquiryOptions extends COps.CreateContentOptions<Inquiry> {

  @Validator.MinLength(1, {
    message: 'Name must be at least 1 characters.'
  })
  @Validator.MaxLength(255, {
    message: 'Name cannot be more than 255 characters.'
  })
  name: string

  @Validator.IsEmail(undefined, {
    message: 'Please enter a valid email address.'
  })
  @Validator.MaxLength(255, {
    message: 'Email address cannot be more than 255 characters.'
  })
  email: string

  @Validator.MinLength(10, {
    message: 'Message must be at least 10 characters.'
  })
  message: string
}
export class FindInquiryOptions extends COps.FindContentOptions<Inquiry> {}
export class FindInquiriesOptions extends COps.FindContentsOptions<Inquiry> {}
export class GetInquiryOptions extends COps.GetContentOptions<Inquiry> {}
export class GetInquiriesOptions extends COps.GetContentsOptions<Inquiry> {}

/**
 * Create an inquiry.
 */
export class CreateInquiry extends COps.CreateContent<Inquiry, CreateInquiryOptions> {

  /**
   * Create an inquiry.
   *
   * @param manager The entity manager.
   * @param context The application context.
   *
   * @return The created inquiry.
   */
  protected async _execute(manager: ORM.EntityManager, context: Context): Promise<Inquiry> {

    // Create the inquiry.
    const inquiry = manager.create(Inquiry, {
      name: this.options.name,
      email: this.options.email,
      message: this.options.message,
      state: this.options.state || ContentState.Published,
      createdAt: new Date(),
      createdBy: context.user,
    })

    // Save the inquiry.
    return manager.save(Inquiry, inquiry)
  }
}

/**
 * Find an inquiry.
 */
export class FindInquiry extends COps.FindContent<Inquiry, FindInquiryOptions> {
  constructor(options: FindInquiryOptions) {
    super(options, Inquiry)
  }
}

/**
 * Find a list of inquiries.
 */
export class FindInquiries extends COps.FindContents<Inquiry, FindInquiriesOptions> {
  constructor(options: FindInquiriesOptions) {
    super(options, Inquiry)
  }
}

/**
 * Get an inquiry.
 */
export class GetInquiry extends COps.GetContent<Inquiry, COps.GetContentOptions<Inquiry>> {
  constructor(options: COps.GetContentOptions<Inquiry>) {
    super(options, Inquiry)
  }
}

/**
 * Get a list of inquiries.
 */
export class GetInquiries extends COps.GetContents<Inquiry, COps.GetContentsOptions<Inquiry>> {
  constructor(options: COps.GetContentsOptions<Inquiry>) {
    super(options, Inquiry)
  }
}
