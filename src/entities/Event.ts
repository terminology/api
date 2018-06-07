import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, RelationId } from 'typeorm'
import { User } from './User'

/**
 * Check if an object is an event.
 *
 * @param input The object to check.
 *
 * @return True if the object is an event, false otherwise.
 */
export function isEvent(input: any): input is Event {
  return input instanceof Event
}

@Entity({
  name: 'Events'
})
export class Event {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    type: string

    @Column({ type: 'simple-json', default: {} })
    options: Object

    @Column({ type: 'datetime' })
    createdAt: Date

    @OneToOne(type => User, { nullable: true })
    @JoinColumn()
    createdBy?: User

    @RelationId((event: Event) => event.createdBy)
    createdById?: number
}
