import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'
import { Content } from './Content'

/**
 * Check if an object is a domain.
 *
 * @param input The object to check.
 *
 * @return True if the object is a domain, false otherwise.
 */
export function isDomain(input: any): input is Domain {
  return input instanceof Domain
}

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
