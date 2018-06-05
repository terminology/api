import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'
import { Content } from './Content'

@Entity({
  name: 'Domains'
})
export class Domain extends Content {

  @Column()
  name: string

  @Column()
  slug: string

  @Column({ type: 'tinytext' })
  summary: string
  
  @Column()
  private: boolean
}
