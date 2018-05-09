import * as Validator from 'class-validator'
import * as Transformer from 'class-transformer'
import * as lodash from 'lodash'
import { Context } from 'koa'
import { Operation } from './Operation'
import * as ORM from 'typeorm'
import { Content, ContentState } from '../entities/Content'

/**
 * Options for creating a content item.
 */
export abstract class CreateContentOptions<C extends Content> {

  @Transformer.Expose({ groups: [ 'admin' ]})
  @Validator.ValidateIf(o => !!o.state)
  @Validator.IsEnum(ContentState, {
    message: 'State must be "draft", "published", or "deleted".'
  })
  state?: ContentState
}

/**
 * Options for creating a list of content items.
 */
export abstract class CreateContentsOptions<C extends Content> {

  @Transformer.Expose({ groups: [ 'admin' ]})
  @Validator.ValidateIf(o => !!o.state)
  @Validator.IsEnum(ContentState, {
    message: 'State must be "draft", "published", or "deleted".'
  })
  state?: ContentState
}

/**
 * Options for finding a content item.
 */
export abstract class FindContentOptions<C extends Content> implements ORM.FindOneOptions<C> {

  /**
   * Specifies what columns should be retrieved.
   */
  select?: (keyof C)[]

  /**
   * Simple condition that should be applied to match entities.
   */
  where?: ORM.FindConditions<C> | ORM.ObjectLiteral | string

  /**
   * Indicates what relations of entity should be loaded (simplified left join form).
   */
  relations?: string[]

  /**
   * Specifies what relations should be loaded.
   */
  join?: ORM.JoinOptions

  /**
   * Order, in which entities should be ordered.
   */
  order?: { [P in keyof C]?: "ASC" | "DESC" | 1 | -1 }

  /**
   * Enables or disables query result caching.
   */
  cache?: boolean | number | { id: any, milliseconds: number }

  /**
   * If sets to true then loads all relation ids of the entity and maps them into relation values (not relation objects).
   * If array of strings is given then loads only relation ids of the given properties.
   */
  loadRelationIds?: boolean | { relations?: string[], disableMixedMap?: boolean } // todo: extract options into separate interface, reuse

  /**
   * Indicates if eager relations should be loaded or not.
   * By default they are loaded when find methods are used.
   */
  loadEagerRelations?: boolean
}

/**
 * Options for finding a list of content items.
 */
export abstract class FindContentsOptions<C extends Content> extends FindContentOptions<C> implements ORM.FindManyOptions<C> {

  /**
   * Offset (paginated) where from entities should be taken.
   */
  @Validator.IsInt()
  @Transformer.Type(() => Number)
  skip?: number

  /**
   * Limit (paginated) - max number of entities should be taken.
   */
  @Validator.IsInt()
  @Validator.Min(1)
  @Validator.Max(100)
  @Transformer.Type(() => Number)
  take?: number
}

/**
 * Options for finding or creating a content item.
 */
export abstract class FindCreateContentOptions<
  C extends Content,
  FO extends FindContentOptions<C>,
  CO extends CreateContentOptions<C>
> {
  find?: FO
  create: CO
}

/**
 * Options for finding or creating a list of content items.
 */
export abstract class FindCreateContentsOptions<
  C extends Content,
  FO extends FindContentsOptions<C>,
  CO extends CreateContentsOptions<C>
> {
  find?: FO
  create: CO
}

/**
 * Options for getting a content item.
 */
export abstract class GetContentOptions<C extends Content> {

  @Validator.IsInt()
  @Transformer.Type(() => Number)
  id: number
}

/**
 * Options for getting a list of content items.
 */
export abstract class GetContentsOptions<C extends Content> {
  ids: number[]
}

/**
 * Options for updating a content item.
 */
export abstract class UpdateContentOptions<C extends Content> extends GetContentOptions<C> {

  @Transformer.Expose({ groups: [ 'admin' ]})
  @Validator.ValidateIf(o => !!o.state)
  @Validator.IsEnum(ContentState, {
    message: 'State must be "draft", "published", or "deleted".'
  })
  state?: ContentState
}

/**
 * Options for updating a list of content items.
 */
export abstract class UpdateContentsOptions<C extends Content> extends GetContentsOptions<C> {

  @Transformer.Expose({ groups: [ 'admin' ]})
  @Validator.ValidateIf(o => !!o.state)
  @Validator.IsEnum(ContentState, {
    message: 'State must be "draft", "published", or "deleted".'
  })
  state?: ContentState
}

/**
 * Operations
 */

/**
 * Base content operation.
 */
export abstract class ContentOperation<O, C> extends Operation<O, C> {}

/**
 * Create a content item.
 */
export abstract class CreateContent<C extends Content, O extends CreateContentOptions<C>> extends ContentOperation<O, C> {}

/**
 * Create a list of content items.
 */
export abstract class CreateContents<C extends Content, O extends CreateContentsOptions<C>> extends ContentOperation<O, C[]> {}

/**
 * Find a content item.
 *
 * @param options The find options.
 * @param type    The content constructor.
 */
export abstract class FindContent<C extends Content, O extends FindContentOptions<C>> extends ContentOperation<O, C | undefined> {
  protected type: ORM.ObjectType<C>

  /**
   * Instantiate a find content operation.
   *
   * @param options The find options.
   * @param type    The content constructor.
   */
  constructor(options: O, type: ORM.ObjectType<C>) {
    super(options)
    this.type = type
  }

  /**
   * Find a of content item.
   *
   * @param manager The entity manager.
   * @param context The application context.
   *
   * @return The content item.
   */
  protected async _execute(manager: ORM.EntityManager, context: Context): Promise<C | undefined> {
    return manager.findOne(this.type, this.options)
  }
}

/**
 * Find a list of content items.
 *
 * @param options The find options.
 * @param type    The content constructor.
 */
export abstract class FindContents<C extends Content, O extends FindContentsOptions<C>> extends ContentOperation<O, C[]> {
  protected type: ORM.ObjectType<C>

  /**
   * Instantiate a find content operation.
   *
   * @param options The find options.
   * @param type    The content constructor.
   */
  constructor(options: O, type: ORM.ObjectType<C>) {
    super(options)
    this.type = type
  }

  /**
   * Find the list of content items.
   *
   * @param manager The entity manager.
   * @param context The application context.
   *
   * @return The content items.
   */
  protected async _execute(manager: ORM.EntityManager, context: Context): Promise<C[]> {
    return manager.find(this.type, this.options)
  }
}

/**
 * Find or Create a content item.
 */
export abstract class FindCreateContent<
  C extends Content,
  FO extends FindContentOptions<C>,
  CO extends CreateContentOptions<C>,
  O extends FindCreateContentOptions<C, FO, CO>
> extends ContentOperation<O, C> {}

/**
 * Find or Create a list of content items.
 */
export abstract class FindCreateContents<
  C extends Content,
  FO extends FindContentsOptions<C>,
  CO extends CreateContentsOptions<C>,
  O extends FindCreateContentsOptions<C, FO, CO>
> extends ContentOperation<O, C[]> {}

/**
 * Get a content item.
 */
export abstract class GetContent<C extends Content, O extends GetContentOptions<C>> extends ContentOperation<O, C | undefined> {
  protected type: ORM.ObjectType<C>

  /**
   * Instantiate a find content operation.
   *
   * @param options The find options.
   * @param type    The content constructor.
   */
  constructor(options: O, type: ORM.ObjectType<C>) {
    super(options)
    this.type = type
  }

  /**
   * Get a content item.
   *
   * @param manager The entity manager.
   * @param context The application context.
   *
   * @return The content item or undefined.
   */
  protected async _execute(manager: ORM.EntityManager, context: Context): Promise<C | undefined> {
    return manager.findOne(this.type, { where: { id: this.options.id }})
  }
}

/**
 * Get a list of content items.
 */
export abstract class GetContents<C extends Content, O extends GetContentsOptions<C>> extends ContentOperation<O, C[]> {
  protected type: ORM.ObjectType<C>

  /**
   * Instantiate a find content operation.
   *
   * @param options The find options.
   * @param type    The content constructor.
   */
  constructor(options: O, type: ORM.ObjectType<C>) {
    super(options)
    this.type = type
  }

  /**
   * Get a list of content items.
   *
   * @param manager The entity manager.
   * @param context The application context.
   *
   * @return The list of content items.
   */
  protected async _execute(manager: ORM.EntityManager, context: Context): Promise<C[]> {
    return manager.find(this.type, { where: { id: this.options.ids }})
  }
}

/**
 * Update a content item.
 */
export abstract class UpdateContent<C extends Content, O extends UpdateContentOptions<C>> extends ContentOperation<O, C | undefined> {}

/**
 * Update a list of content items.
 */
export abstract class UpdateContents<C extends Content, O extends UpdateContentsOptions<C>> extends ContentOperation<O, C[]> {}
