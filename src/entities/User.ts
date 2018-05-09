import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, RelationId } from 'typeorm'
import { Content } from './Content'
import ModelHelper from '../helpers/Model'

export enum UserState {
  Pending = 'pending',
  Active = 'active',
  Deleted = 'deleted'
}

export enum UserRole {
  Admin = 'admin',
  Contributor = 'contributor'
}

@Entity({
  name: 'Users'
})
export class User {

  @PrimaryGeneratedColumn()
  id: number

  @Column()
  state: UserState = UserState.Pending

  @Column()
  role: UserRole = UserRole.Contributor

  @Column()
  name: string

  @Column()
  email: string

  @Column({ type: 'datetime', nullable: true })
  emailConfirmedAt?: Date

  @Column({ select: false })
  @ModelHelper.Transformer.Exclude()
  emailConfirmationToken?: string = undefined

  @Column()
  @ModelHelper.Transformer.Exclude()
  passwordHash?: string

  @Column({ type: 'datetime', nullable: true })
  passwordResetAt?: Date

  @Column()
  @ModelHelper.Transformer.Exclude()
  passwordResetToken?: string = ''

  @Column({ type: 'datetime', nullable: true })
  lastAuthenticatedAt?: Date

  @Column({ type: 'datetime' })
  createdAt: Date

  @OneToOne(type => User, { nullable: true })
  @JoinColumn()
  createdBy?: User

  @RelationId((user: User) => user.createdBy)
  createdById?: number

  @Column({ type: 'datetime', nullable: true })
  lastUpdatedAt?: Date

  @OneToOne(type => User, { nullable: true })
  @JoinColumn()
  lastUpdatedBy?: User

  @RelationId((user: User) => user.lastUpdatedBy)
  lastUpdatedById?: number

  /**
   * Check if the user created the content.
   *
   * @param content The content.
   *
   * @return True if the user created the content, false otherwise.
   */
  isCreator(content: Content): boolean {
    return content.createdBy ? this.id === content.createdBy.id : this.id === content.createdById
  }

  /**
   * Check if the user is in an admin.
   *
   * @return True if the user is in an admin, false otherwise.
   */
  isAdmin(): boolean {
    return this.role === UserRole.Admin
  }

  /**
   * Check if the user is in a contributor.
   *
   * @return True if the user is in a contributor, false otherwise.
   */
  isContributor(): boolean {
    return this.role === UserRole.Contributor
  }

  /**
   * Check if the user is in an active state.
   *
   * @return True if the user is in an active state, false otherwise.
   */
  isActive(): boolean {
    return this.state === UserState.Active
  }

  /**
   * Check if the user is in a deleted state.
   *
   * @return True if the user is in a deleted state, false otherwise.
   */
  isDeleted(): boolean {
    return this.state === UserState.Deleted
  }

  /**
   * Check if the user is in a pending state.
   *
   * @return True if the user is in a pending state, false otherwise.
   */
  isPending(): boolean {
    return this.state === UserState.Pending
  }
}
