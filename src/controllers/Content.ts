import * as Transformer from 'class-transformer'
import * as lodash from 'lodash'
import { Context } from 'koa'
import { OperationController } from './Operation'
import * as ORM from 'typeorm'
import { Content } from '../entities/Content'
import * as COps from '../operations/Content'

/**
 * Constructor type signature so TS knows these objects can be instantiated with new.
 */
export type Constructor<T> = {
  new (...any: any[]): T
}

/**
 * The type signature of this controller is obviously ridiculous but it does have some nice
 * qualities such as being able to define a type as never to opt out of the particular
 * functionality. Ideally, this would be broken down into smaller controllers that can be composed
 * together to create the desired range of functionality.
 */
export abstract class ContentController<
  // Content
  C extends Content,

  // Create
  CreateOneOptions extends COps.CreateContentOptions<C> | never,
  CreateManyOptions extends COps.CreateContentsOptions<C> | never,
  CreateOne extends COps.CreateContent<C, CreateOneOptions> | never,
  CreateMany extends COps.CreateContents<C, CreateManyOptions> | never,

  // Find
  FindOneOptions extends COps.FindContentOptions<C> | never,
  FindManyOptions extends COps.FindContentsOptions<C> | never,
  FindOne extends COps.FindContent<C, FindOneOptions> | never,
  FindMany extends COps.FindContents<C, FindManyOptions> | never,

  // Find/Create
  FindCreateOneOptions extends COps.FindCreateContentOptions<C, FindOneOptions, CreateOneOptions> | never,
  FindCreateManyOptions extends COps.FindCreateContentsOptions<C, FindManyOptions, CreateManyOptions> | never,
  FindCreateOne extends COps.FindCreateContent<C, FindOneOptions, CreateOneOptions, FindCreateOneOptions> | never,
  FindCreateMany extends COps.FindCreateContents<C, FindManyOptions, CreateManyOptions, FindCreateManyOptions> | never,

  // Get
  GetOneOptions extends COps.GetContentOptions<C> | never,
  GetManyOptions extends COps.GetContentsOptions<C> | never,
  GetOne extends COps.GetContent<C, GetOneOptions> | never,
  GetMany extends COps.GetContents<C, GetManyOptions> | never,

  // Update
  UpdateOneOptions extends COps.UpdateContentOptions<C> | never,
  UpdateManyOptions extends COps.UpdateContentsOptions<C> | never,
  UpdateOne extends COps.UpdateContent<C, UpdateOneOptions> | never,
  UpdateMany extends COps.UpdateContents<C, UpdateManyOptions> | never,
> extends OperationController {

  // Content
  protected type: ORM.ObjectType<C>

  // Create
  protected createOneOptions: Constructor<CreateOneOptions> | never
  protected createManyOptions: Constructor<CreateManyOptions> | never
  protected createOne: Constructor<CreateOne> | never
  protected createMany: Constructor<CreateMany> | never

  // Find
  protected findOneOptions: Constructor<FindOneOptions> | never
  protected findManyOptions: Constructor<FindManyOptions> | never
  protected findOne: Constructor<FindOne> | never
  protected findMany: Constructor<FindMany> | never

  // Find/Create
  protected findCreateOneOptions: Constructor<FindCreateOneOptions> | never
  protected findCreateManyOptions: Constructor<FindCreateManyOptions> | never
  protected findCreateOne: Constructor<FindCreateOne> | never
  protected findCreateMany: Constructor<FindCreateMany> | never

  // Get
  protected getOneOptions: Constructor<GetOneOptions> | never
  protected getManyOptions: Constructor<GetManyOptions> | never
  protected getOne: Constructor<GetOne> | never
  protected getMany: Constructor<GetMany> | never

  // Update
  protected updateOneOptions: Constructor<UpdateOneOptions> | never
  protected updateManyOptions: Constructor<UpdateManyOptions> | never
  protected updateOne: Constructor<UpdateOne> | never
  protected updateMany: Constructor<UpdateMany> | never

  /**
   * Create a content item.
   *
   * @param context The application context.
   */
  public async create(context: Context) {

    // Check if the controller supports the operation.
    if (!this.createOneOptions || !this.createOne) {
      context.throw(403, new Error('The requested operation is not supported.'))
    }

    // Build the options.
    let options = this._buildCreateOneOptions(context)

    // Validate the options.
    let errors = await this._validate(options)
    if (errors.length) {
      return this.handleValidationErrors(errors, context)
    }

    // Perform the operation in a transaction.
    return ORM
      .getConnection()
      .transaction(async manager => {

        // Create the content.
        let created = await new (this.createOne)(options).execute(manager, context)

        // Send the response.
        return this.json(context, 201, created)
      })
  }

  /**
   * Find content items.
   *
   * @param context The application context.
   */
  public async find(context: Context) {

    // Check if the controller supports the operation.
    if (!this.findManyOptions || !this.findMany) {
      context.throw(403, new Error('The requested operation is not supported.'))
    }

    // Build the options.
    let options = this._buildFindManyOptions(context)

    // Validate the options.
    let errors = await this._validate(options)
    if (errors.length) {
      return this.handleValidationErrors(errors, context)
    }

    // Perform the operation in a transaction.
    return ORM
      .getConnection()
      .transaction(async manager => {

        // Find the content.
        let contents = await new (this.findMany)(options).execute(manager, context)

        // Send the response.
        return this.json(context, 200, contents)
      })
  }

  /**
   * Get a content item.
   *
   * @param context The application context.
   */
  public async get(context: Context) {

    // Check if the controller supports the operation.
    if (!this.getOneOptions || !this.getOne) {
      context.throw(403, new Error('The requested operation is not supported.'))
    }

    // Build the options.
    let options = this._buildGetOneOptions(context)

    // Validate the options.
    let errors = await this._validate(options)
    if (errors.length) {
      return this.handleValidationErrors(errors, context)
    }

    // Perform the operation in a transaction.
    return ORM
      .getConnection()
      .transaction(async manager => {

        // Get the content.
        let content = await new (this.getOne)(options).execute(manager, context)

        // Check if the content was found.
        if (!content) {
          context.throw(404, new Error('The requested content could not be found.'))
        }

        // Send the response.
        return this.json(context, 200, content)
      })
  }

  /**
   * Update a content item.
   *
   * @param context The application context.
   */
  public async update(context: Context) {

    // Check if the controller supports the operation.
    if (!this.updateOneOptions || !this.updateOne) {
      context.throw(403, new Error('The requested operation is not supported.'))
    }

    // Build the options.
    let options = this._buildUpdateOneOptions(context)

    // Validate the options.
    let errors = await this._validate(options)
    if (errors.length) {
      return this.handleValidationErrors(errors, context)
    }

    // Perform the operation in a transaction.
    return ORM
      .getConnection()
      .transaction(async manager => {

        // Get the content.
        let content = await new (this.updateOne)(options).execute(manager, context)

        // Check if the content was found.
        if (!content) {
          context.throw(404, new Error('The requested content could not be found.'))
        }

        // Send the response.
        return this.json(context, 200, content)
      })
  }

  /**
   * Build the options to create a content item.
   *
   * @param context The application context.
   *
   * @return The options to create a content item.
   */
  protected _buildCreateOneOptions(context: Context): CreateOneOptions {
    return ContentController.Transformer.plainToClass<CreateOneOptions, object>(
      this.createOneOptions,
      context.request.body,
      this._buildDecodeTransformOptions(context)
    )
  }

  /**
   * Build the options to get a content item.
   *
   * @param context The application context.
   *
   * @return The options to get a content item.
   */
  protected _buildGetOneOptions(context: Context): GetOneOptions {

    // Get the relations to populate.
    const relations = context.query.relations ? context.query.relations.split(/,/g) : []

    return ContentController.Transformer.plainToClass<GetOneOptions, object>(
      this.getOneOptions,
      {
        id: context.params.contentId,
        relations: relations,
      },
      this._buildDecodeTransformOptions(context)
    )
  }

  /**
   * Build the options to find a list of content items.
   *
   * @param context The application context.
   *
   * @return The options to find a list of content items.
   */
  protected _buildFindManyOptions(context: Context): FindManyOptions {

    // Get the relations to populate.
    const relations = context.query.relations ? context.query.relations.split(/,/g) : []

    return ContentController.Transformer.plainToClass<FindManyOptions, object>(
      this.findManyOptions,
      {
        skip: context.query.skip || 0,
        take: context.query.take || 10,
        relations: relations,
      },
      this._buildDecodeTransformOptions(context)
    )
  }

  /**
   * Build the options to update a content item.
   *
   * @param context The application context.
   *
   * @return The options to update a content item.
   */
  protected _buildUpdateOneOptions(context: Context): UpdateOneOptions {
    return ContentController.Transformer.plainToClass<UpdateOneOptions, object>(
      this.updateOneOptions,
      Object.assign(
        {},
        context.request.body,
        { id: context.params.contentId }
      ),
      this._buildDecodeTransformOptions(context)
    )
  }

  /**
   * Build the options for the class transformer when decoding request data.
   *
   * @param context The application context.
   *
   * @return The transform options.
   */
  protected _buildDecodeTransformOptions(context: Context): Transformer.ClassTransformOptions {
    return {
      groups: context.user ? [ context.user.role ] : [ 'contributor' ]
    }
  }
}
