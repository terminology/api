import * as Validator from 'class-validator'
import * as Transformer from 'class-transformer'
import * as lodash from 'lodash'
import { Context } from 'koa'
import { Operation } from './Operation'
import * as ORM from 'typeorm'
import { Content, ContentState } from '../entities/Content'
import { User } from '../entities/User'
import { Paths, expandPaths, collapsePaths, Populater, Populaters } from '../helpers/Entity'
import * as UOps from './User'

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
   * Simple condition that should be applied to match entities.
   */
  @Validator.Allow()
  where?: ORM.FindConditions<C> | ORM.ObjectLiteral | string

  /**
   * Indicates what relations of entity should be loaded (simplified left join form).
   */
  @Validator.Allow()
  relations?: string[]

  /**
   * Order, in which entities should be ordered.
   */
  order?: { [P in keyof C]?: "ASC" | "DESC" | 1 | -1 }
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

  @Validator.Allow()
  relations?: string[] = []
}

/**
 * Options for getting a list of content items.
 */
export abstract class GetContentsOptions<C extends Content> {
  ids: number[]

  @Validator.Allow()
  relations?: string[] = []
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
    return manager.find(this.type, this.options as ORM.FindManyOptions<C>)
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
 * Populate the created by user for a content item.
 *
 * @param manager   The entity manager.
 * @param context   The application context.
 * @param content   The content item.
 * @param relations The sub-relations to populate.
 *
 * @return The content item.
 */
export async function populateCreatedBy<C extends Content>(manager: ORM.EntityManager, context: Context, content: C, relations?: string[]): Promise<User | undefined> {

  // Check if a created by user exists.
  if (!content.createdById) {
    return undefined
  }

  // Get the created by user.
  return new UOps.GetUser({ id: content.createdById }).execute(manager, context)
}

/**
 * Populate the last updated by user for a content item.
 *
 * @param manager   The entity manager.
 * @param context   The application context.
 * @param content   The content item.
 * @param relations The sub-relations to populate.
 *
 * @return The content item.
 */
export async function populateLastUpdatedBy<C extends Content>(manager: ORM.EntityManager, context: Context, content: C, relations?: string[]): Promise<User | undefined> {

  // Check if a last updated by user exists.
  if (!content.lastUpdatedById) {
    return undefined
  }

  // Get the last updated by user.
  return await new UOps.GetUser({ id: content.lastUpdatedById }).execute(manager, context)
}

/**
 * Get a content item.
 */
export abstract class GetContent<C extends Content, O extends GetContentOptions<C>> extends ContentOperation<O, C | undefined> {
  protected type: ORM.ObjectType<C>
  protected populaters: Populaters<C>

  /**
   * Instantiate a find content operation.
   *
   * @param options The find options.
   * @param type    The content constructor.
   */
  constructor(options: O, type: ORM.ObjectType<C>) {
    super(options)
    this.type = type
    this.populaters = {
      createdBy: populateCreatedBy,
      lastUpdatedBy: populateLastUpdatedBy
    }
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

    // Get the content item.
    let content = await manager.findOne(this.type, { where: { id: this.options.id } })

    // Check if the content was not found or there are no relations to populate.
    if (!content || !this.options.relations || lodash.isEmpty(this.options.relations)) {
      return content
    }

    // Convert nested relations into structured paths.
    let populate = expandPaths(this.options.relations)

    // Populate each relation specified.
    let promises = lodash.map(
      populate,
      (paths: Paths, key: string) => {

        // Check if a populater is specified for the relation.
        if (!this.populaters[key] || !content) {
          return Promise.resolve(content)
        }

        // Populate the relation for the content item.
        return this.populaters[key](manager, context, content, collapsePaths(paths))
      }
    )

    // Wait for all relations to populate.
    let results = await Promise.all(promises)

    // Merge the populated properties into the content item.
    content = lodash.reduce(
      lodash.zipObject(Object.keys(populate), results),
      (content, populated, key) => {
        content[key] = populated
        return content
      },
      content
    )

    return content
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
    return manager.find(this.type, { where: { id: this.options.ids } })
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
