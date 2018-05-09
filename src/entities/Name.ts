import { Column } from 'typeorm'

export class Name {

  @Column()
  display: string

  @Column({ default: '' })
  first?: string

  @Column({ default: '' })
  last?: string
}
