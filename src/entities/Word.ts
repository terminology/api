import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm'
import { Content } from './Content'

@Entity({
  name: 'Words'
})
export class Word extends Content {

  @Column({ unique: true })
  name: string

  @Column({ unique: true })
  slug: string

  @Column()
  stem: string

  @Column({ type: 'smallint' })
  length: number

  @Column({ default: false })
  numeric: boolean = false

  @Column({ default: false })
  acronym: boolean = false
}
