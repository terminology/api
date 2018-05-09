import * as Validator from 'class-validator'
import * as Transformer from 'class-transformer'
import { Context } from 'koa'
import * as ORM from 'typeorm'
import { Event } from '../entities/Event'

/**
 * Check if an object is an operation.
 *
 * @param x The object to check.
 *
 * @return True if the object is an operation, false otherwise.
 */
export function isOperation<O, T>(x: any): x is Operation<O, T> {
  return x instanceof Operation
}

/**
 * Abstract operation.
 */
export abstract class Operation<O, T> {

  /**
   * The operation options.
   */
  protected options: O

  /**
   * Instantiate the operation.
   *
   * @param options The operation options.
   */
  constructor(options: O) {
    this.options = options || {}
  }

  /**
   * Execute the operation.
   *
   * @param manager The entity manager. This is provided here to allow the operations to be
   * composed within a transaction. In TypeORM, the entity manager is transaction specific so
   * injecting a single entity manager instance will break transaction functionality.
   * @param context The application context.
   *
   * @return The result of the operation.
   */
  public async execute(manager: ORM.EntityManager, context: Context): Promise<T> {

    // Create an event to record the operation.
    let event = manager.create(Event, {
      type: this.constructor.name,
      options: this.options as {},
      createdAt: new Date(),
      createdBy: context.user
    })

    // Save the event.
    event = await manager.save(Event, event)

    // Execute the operation.
    return this._execute(manager, context)
  }

  /**
   * Do the actual work of the operation.
   *
   * @param manager The entity manager.
   * @param context The application context.
   *
   * @return The result of the operation.
   */
  protected abstract async _execute(manager: ORM.EntityManager, context: Context): Promise<T>
}
