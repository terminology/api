import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'
import { Content } from './Content'

/**
 * Check if an object is an inquiry.
 *
 * @param input The object to check.
 *
 * @return True if the object is an inquiry, false otherwise.
 */
export function isInquiry(input: any): input is Inquiry {
  return input instanceof Inquiry
}

@Entity({
  name: 'Inquiries'
})
export class Inquiry extends Content {

  @Column()
  name: string

  @Column()
  email: string

  @Column({ type: 'tinytext' })
  message: string
}
