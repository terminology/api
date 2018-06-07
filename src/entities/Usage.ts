import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import { Content } from './Content'
import { Connection } from './Connection'

/**
 * Check if an object is a usage.
 *
 * @param input The object to check.
 *
 * @return True if the object is a usage, false otherwise.
 */
export function isUsage(input: any): input is Usage {
  return input instanceof Usage
}

@Entity({
  name: 'Usages'
})
export class Usage extends Content {

  @Column()
  name: string

  @Column()
  slug: string

  @Column({ type: 'tinytext' })
  summary: string

  @OneToMany(type => Connection, connection => connection.usage)
  connections: Connection[]
}
