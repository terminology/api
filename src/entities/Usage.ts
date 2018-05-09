import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import { Content } from './Content'
import { Connection } from './Connection'

@Entity({
  name: 'Usages'
})
export class Usage extends Content {

  @Column()
  name: string

  @Column()
  slug: string

  @OneToMany(type => Connection, connection => connection.usage)
  connections: Connection[]
}
