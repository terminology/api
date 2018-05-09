import * as natural from 'natural'
import * as slug from 'slug'
slug.defaults.mode = 'rfc3986'
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
// @Index("state_slug_unique", (term: Term) => [ term.state, term.slug ], { unique: true })
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
