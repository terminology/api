import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, RelationId } from 'typeorm'
import { Content } from './Content'
import { Term } from './Term'
import { Usage } from './Usage'

@Entity({
  name: 'Connections'
})
export class Connection extends Content {

  @OneToOne(type => Term)
  @JoinColumn()
  term: Term

  @RelationId((connection: Connection) => connection.term)
  termId: number

  @OneToOne(type => Usage)
  @JoinColumn()
  usage: Usage

  @RelationId((connection: Connection) => connection.usage)
  usageId: number

  @Column()
  weight: number = 0
}
