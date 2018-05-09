import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, RelationId } from 'typeorm'
import { User } from './User'

@Entity({
  name: 'Events'
})
export class Event {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    type: string

    @Column({ type: 'simple-json', default: {} })
    options: {}

    @Column({ type: 'datetime' })
    createdAt: Date

    @OneToOne(type => User, { nullable: true })
    @JoinColumn()
    createdBy?: User

    @RelationId((event: Event) => event.createdBy)
    createdById?: number
}
