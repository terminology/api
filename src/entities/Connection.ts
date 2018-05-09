import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm'
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

  @OneToOne(type => Usage)
  @JoinColumn()
  usage: Usage

  @Column()
  weight: number = 0
}
