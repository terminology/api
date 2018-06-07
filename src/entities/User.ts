import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, RelationId } from 'typeorm'
import { Content } from './Content'
import * as Transformer from 'class-transformer'

export enum UserState {
  Pending = 'pending',
  Active = 'active',
  Deleted = 'deleted'
}

export enum UserRole {
  Admin = 'admin',
  Contributor = 'contributor'
}

/**
 * Check if an object is a user.
 *
 * @param input The object to check.
 *
 * @return True if the object is a user, false otherwise.
 */
export function isUser(input: any): input is User {
  return input instanceof User
}

@Entity({
  name: 'Users'
})
export class User {

  @PrimaryGeneratedColumn()
  id: number

  @Column()
  @Transformer.Expose({ groups: [ 'owner', 'admin' ]})
  state: UserState = UserState.Pending

  @Column()
  @Transformer.Expose({ groups: [ 'owner', 'admin' ]})
  role: UserRole = UserRole.Contributor

  @Column()
  name: string

  @Column()
  @Transformer.Expose({ groups: [ 'owner', 'admin' ]})
  email: string

  @Column({ type: 'datetime', nullable: true })
  @Transformer.Expose({ groups: [ 'owner', 'admin' ]})
  emailConfirmedAt?: Date

  @Column({ select: false })
  @Transformer.Expose({ groups: [ 'admin' ]})
  emailConfirmationToken?: string = undefined

  @Column()
  @Transformer.Exclude()
  passwordHash?: string

  @Column({ type: 'datetime', nullable: true })
  @Transformer.Expose({ groups: [ 'owner', 'admin' ]})
  passwordResetAt?: Date

  @Column()
  @Transformer.Expose({ groups: [ 'admin' ]})
  passwordResetToken?: string = ''

  @Column({ type: 'datetime', nullable: true })
  @Transformer.Expose({ groups: [ 'owner', 'admin' ]})
  lastAuthenticatedAt?: Date

  @Column({ type: 'datetime' })
  @Transformer.Expose({ groups: [ 'owner', 'admin' ]})
  createdAt: Date

  @OneToOne(type => User, { nullable: true })
  @JoinColumn()
  @Transformer.Expose({ groups: [ 'owner', 'admin' ]})
  createdBy?: User

  @RelationId((user: User) => user.createdBy)
  @Transformer.Expose({ groups: [ 'owner', 'admin' ]})
  createdById?: number

  @Column({ type: 'datetime', nullable: true })
  @Transformer.Expose({ groups: [ 'owner', 'admin' ]})
  lastUpdatedAt?: Date

  @OneToOne(type => User, { nullable: true })
  @JoinColumn()
  @Transformer.Expose({ groups: [ 'owner', 'admin' ]})
  lastUpdatedBy?: User

  @RelationId((user: User) => user.lastUpdatedBy)
  @Transformer.Expose({ groups: [ 'owner', 'admin' ]})
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
