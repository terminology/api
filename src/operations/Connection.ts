import * as Validator from 'class-validator'
import * as Transformer from 'class-transformer'
import * as lodash from 'lodash'
import * as ORM from 'typeorm'
import * as COps from './Content'
import * as Lang from '../helpers/Lang'
import { Context } from 'koa'
import { Content, ContentState } from '../entities/Content'
import { Connection } from '../entities/Connection'
import * as TOps from './Term'
import * as UOps from './Usage'

export class CreateConnectionOptions extends COps.CreateContentOptions<Connection> {

  @Validator.IsInt()
  @Transformer.Type(() => Number)
  termId: number

  @Validator.IsInt()
  @Transformer.Type(() => Number)
  usageId: number
}
export class CreateConnectionsOptions extends COps.CreateContentsOptions<Connection> {
  list: CreateConnectionOptions[]
}
export class FindConnectionOptions extends COps.FindContentOptions<Connection> {}
export class FindConnectionsOptions extends COps.FindContentsOptions<Connection> {}
export class FindCreateConnectionOptions extends COps.FindCreateContentOptions<Connection, FindConnectionOptions, CreateConnectionOptions> {}
export class FindCreateConnectionsOptions extends COps.FindCreateContentsOptions<Connection, FindConnectionsOptions, CreateConnectionsOptions> {}
export class GetConnectionOptions extends COps.GetContentOptions<Connection> {}
export class GetConnectionsOptions extends COps.GetContentsOptions<Connection> {}
export class UpdateConnectionOptions extends COps.UpdateContentOptions<Connection> {}
export class UpdateConnectionsOptions extends COps.UpdateContentsOptions<Connection> {}

/**
 * Create a connection.
 */
export class CreateConnection extends COps.CreateContent<Connection, CreateConnectionOptions> {

  /**
   * Create a connection.
   *
   * @param manager The entity manager.
   * @param context The application context.
   *
   * @return The created connection.
   */
  protected async _execute(manager: ORM.EntityManager, context: Context): Promise<Connection> {

    // Get the term and usage.
    const termPromise = new TOps.GetTerm({ id: this.options.termId }).execute(manager, context)
    const usagePromise = new UOps.GetUsage({ id: this.options.usageId }).execute(manager, context)

    // Resolve the promises.
    const term = await termPromise, usage = await usagePromise

    // Check if the term and usage were found.
    if (!term) {
      throw new Error('Term could not be found.')
    }
    else if (!usage) {
      throw new Error('Usage could not be found.')
    }

    // Create the connection.
    const connection = manager.create(Connection, {
      term: term,
      usage: usage,
      state: this.options.state || ContentState.Draft,
      weight: 0,
      createdAt: new Date(),
      createdBy: context.user,
    })

    // Save the connection.
    return manager.save(Connection, connection)
  }
}

// /**
//  * Create a list of connections.
//  */
// export class CreateConnections extends COps.CreateContents<Connection, CreateConnectionsOptions> {
//
//   /**
//    * Create a list of connections.
//    *
//    * @param manager The entity manager.
//    * @param context The application context.
//    *
//    * @return The created connections.
//    */
//   protected async _execute(manager: ORM.EntityManager, context: Context): Promise<Connection[]> {
//
//     // Create the connections.
//     const connections = this.options.names.map(name => {
//       return manager.create(Connection, {
//         state: this.options.state || ContentState.Draft,
//         createdAt: new Date(),
//         createdBy: context.user,
//       })
//     })
//
//     // Save the connections.
//     return manager.save(Connection, connections)
//   }
// }

/**
 * Find a connection.
 */
export class FindConnection extends COps.FindContent<Connection, FindConnectionOptions> {
  constructor(options: FindConnectionOptions) {
    super(options, Connection)
  }
}

/**
 * Find a list of connections.
 */
export class FindConnections extends COps.FindContents<Connection, FindConnectionsOptions> {
  constructor(options: FindConnectionsOptions) {
    super(options, Connection)
  }
}

// /**
//  * Find or create a connection.
//  */
// export class FindCreateConnection extends COps.FindCreateContent<Connection, FindConnectionOptions, CreateConnectionOptions, FindCreateConnectionOptions> {
//
//   /**
//    * Find or create a connection.
//    *
//    * @param manager The entity manager.
//    * @param context The application context.
//    *
//    * @return The found/created connection.
//    */
//   protected async _execute(manager: ORM.EntityManager, context: Context): Promise<Connection> {
//
//     const slug = Lang.slugify(this.options.create.name)
//
//     // Try to find an existing connection.
//     let existing = await new FindConnection(
//       Object.assign({}, this.options.find, { where: { slug: slug }, relations: [ 'words', 'variants' ] })
//     ).execute(manager, context)
//
//     // Check if the connection exists.
//     if (existing) {
//       return existing
//     }
//
//     // Create the connection.
//     return new CreateConnection(this.options.create).execute(manager, context)
//   }
// }

// /**
//  * Find or create a list of connections.
//  */
// export class FindCreateConnections extends COps.FindCreateContents<Connection, FindConnectionsOptions, CreateConnectionsOptions, FindCreateConnectionsOptions> {
//
//   /**
//    * Find or create a list of connections.
//    *
//    * @param manager The entity manager.
//    * @param context The application context.
//    *
//    * @return The found/created list of connections.
//    */
//   protected async _execute(manager: ORM.EntityManager, context: Context): Promise<Connection[]> {
//
//     // Index the connection name to the slug.
//     const slugMap = lodash.keyBy(this.options.create.names, (name) => Lang.slugify(name))
//
//     // Find the existing connections.
//     const existing = await new FindConnections({ where: { slug: ORM.In(lodash.keys(slugMap)) } }).execute(manager, context)
//
//     // Index existing connections by slug.
//     const existingMap = lodash.keyBy(existing, 'slug')
//
//     // Find the missing connections by slug.
//     const missingSlugs = lodash.difference(lodash.keys(slugMap), lodash.keys(existingMap))
//     const missingConnections = lodash.values(lodash.pick(slugMap, missingSlugs))
//
//     // Create the missing connections.
//     const created = await new CreateConnections({ names: missingConnections }).execute(manager, context)
//
//     // Merge created and existing.
//     return created.concat(existing)
//   }
// }

/**
 * Get a connection.
 */
export class GetConnection extends COps.GetContent<Connection, COps.GetContentOptions<Connection>> {
  constructor(options: COps.GetContentOptions<Connection>) {
    super(options, Connection)
  }
}

/**
 * Get a list of connections.
 */
export class GetConnections extends COps.GetContents<Connection, COps.GetContentsOptions<Connection>> {
  constructor(options: COps.GetContentsOptions<Connection>) {
    super(options, Connection)
  }
}

/**
 * Update a connection.
 */
export class UpdateConnection extends COps.UpdateContent<Connection, UpdateConnectionOptions> {

  /**
   * Update a connection.
   *
   * @param manager The entity manager.
   * @param context The application context.
   *
   * @return The updated connection.
   */
  protected async _execute(manager: ORM.EntityManager, context: Context): Promise<Connection | undefined> {

    // Get the connection.
    let connection = await new GetConnection(this.options).execute(manager, context)

    // Check if the connection was found.
    if (!connection) {
      return undefined
    }

    // Merge in the updated properties.
    connection = manager.merge(
      Connection,
      connection,
      {
        state: this.options.state || connection.state,
        lastUpdatedAt: new Date(),
        lastUpdatedBy: context.user,
      }
    )

    // Save the connection.
    return manager.save(Connection, connection)
  }
}
