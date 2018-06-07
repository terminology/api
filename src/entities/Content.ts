import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, RelationId } from 'typeorm'
import { User } from './User'

export enum ContentState {
  Draft = 'draft',
  Published = 'published',
  Deleted = 'deleted'
}

export enum ContentAction {
  Access = 'access',
  Create = 'create',
  Delete = 'delete',
  Update = 'update',
  View = 'view'
}

/**
 * Check if an object is a content.
 *
 * @param input The object to check.
 *
 * @return True if the object is a content, false otherwise.
 */
export function isContent(input: any): input is Content {
  return input instanceof Content
}

export abstract class Content {

  @PrimaryGeneratedColumn()
  id: number

  @Column()
  state: ContentState = ContentState.Draft

  @Column({ type: 'datetime' })
  createdAt: Date

  @OneToOne(type => User, { nullable: true })
  @JoinColumn()
  createdBy?: User

  @RelationId((content: Content) => content.createdBy)
  createdById?: number

  @Column({ type: 'datetime', nullable: true })
  lastUpdatedAt?: Date

  @OneToOne(type => User, { nullable: true })
  @JoinColumn()
  lastUpdatedBy?: User

  @RelationId((content: Content) => content.lastUpdatedBy)
  lastUpdatedById?: number

  /**
   * Check if the content is in a deleted state.
   *
   * @return True if the content is in a deleted state, false otherwise.
   */
  isDeleted(): boolean {
    return this.state === ContentState.Deleted
  }

  /**
   * Check if the content is in a draft state.
   *
   * @return True if the content is in a draft state, false otherwise.
   */
  isDraft(): boolean {
    return this.state === ContentState.Draft
  }

  /**
   * Check if the content is in a published state.
   *
   * @return True if the content is in a published state, false otherwise.
   */
  isPublished(): boolean {
    return this.state === ContentState.Published
  }
}
