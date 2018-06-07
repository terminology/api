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
