import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm'
import { Content } from './Content'

/**
 * Check if an object is a word.
 *
 * @param input The object to check.
 *
 * @return True if the object is a word, false otherwise.
 */
export function isWord(input: any): input is Word {
  return input instanceof Word
}

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
