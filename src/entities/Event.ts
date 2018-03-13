import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity({
  name: 'Events'
})
export class Event {

    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: 'datetime' })
    createdAt: Date

    @Column()
    createdById: number
}
