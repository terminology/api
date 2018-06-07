import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, ManyToMany, JoinTable } from 'typeorm'
import { Content } from './Content'
import { Connection } from './Connection'
import { Word } from './Word'

/**
 * Check if an object is a term.
 *
 * @param input The object to check.
 *
 * @return True if the object is a term, false otherwise.
 */
export function isTerm(input: any): input is Term {
  return input instanceof Term
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
    name: 'TermWords',
    joinColumn: {
      name: 'termId',
      referencedColumnName: 'id'
    },
    inverseJoinColumn: {
      name: 'wordId',
      referencedColumnName: 'id'
    }
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
