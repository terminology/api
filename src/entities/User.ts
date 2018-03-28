import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'
import ModelHelper from '../helpers/Model'

@Entity({
  name: 'Users'
})
export class User {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    email: string

    @Column({ default: false })
    emailConfirmed: boolean = false

    @Column({ type: 'datetime', nullable: true })
    emailConfirmedAt?: Date

    @Column({ select: false })
    @ModelHelper.Transformer.Exclude()
    emailConfirmationToken?: string = undefined

    @Column({ select: false })
    @ModelHelper.Transformer.Exclude()
    passwordHash?: string

    @Column({ type: 'datetime', nullable: true })
    passwordResetAt?: Date

    @Column({ select: false })
    @ModelHelper.Transformer.Exclude()
    passwordResetToken?: string = ''

    @Column()
    enabled: boolean = false

    @Column({ type: 'datetime' })
    createdAt: Date

    @Column({ nullable: true })
    createdById?: number

    @Column({ type: 'datetime', nullable: true })
    lastUpdatedAt?: Date

    @Column({ nullable: true })
    lastUpdatedById?: number

    @Column({ type: 'datetime', nullable: true })
    deletedAt?: Date

    @Column({ nullable: true })
    deletedById?: number
}
