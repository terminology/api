import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'
import { Content } from './Content'

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
