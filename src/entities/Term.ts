import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, ManyToMany, JoinTable } from 'typeorm'
import { Content } from './Content'
import { Connection } from './Connection'
import { Word } from './Word'

export enum POS {
  Noun = 'noun',
  Verb = 'verb'
}

@Entity({
  name: 'Terms'
})
export class Term extends Content {

  @Column()
  name: string

  @Column()
  slug: string

  @ManyToMany(type => Word)
  @JoinTable({
    name: 'TermWords'
  })
  words: Word[]

  @ManyToMany(type => Term)
  @JoinTable({
    name: 'TermVariants'
  })
  variants: Term[]

  @OneToMany(type => Connection, connection => connection.term)
  connections: Connection[]
}
