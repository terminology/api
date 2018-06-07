import * as lodash from 'lodash'
import { Context } from 'koa'
import * as ORM from 'typeorm'
import { Term } from '../entities/Term'
import { ContentController } from './Content'
import * as Ops from '../operations/Term'

export class TermController extends ContentController<
  Term,

  // Create.
  Ops.CreateTermOptions,
  Ops.CreateTermsOptions,
  Ops.CreateTerm,
  Ops.CreateTerms,

  // Find
  Ops.FindTermOptions,
  Ops.FindTermsOptions,
  Ops.FindTerm,
  Ops.FindTerms,

  // Find/Create
  Ops.FindCreateTermOptions,
  Ops.FindCreateTermsOptions,
  Ops.FindCreateTerm,
  Ops.FindCreateTerms,

  // Get
  Ops.GetTermOptions,
  Ops.GetTermsOptions,
  Ops.GetTerm,
  Ops.GetTerms,

  // Update
  Ops.UpdateTermOptions,
  never,
  Ops.UpdateTerm,
  never
> {
  constructor() {
    super()
    this.type = Term

    // Create
    this.createOneOptions = Ops.CreateTermOptions
    this.createManyOptions = Ops.CreateTermsOptions
    this.createOne = Ops.CreateTerm
    this.createMany = Ops.CreateTerms

    // Find
    this.findOneOptions = Ops.FindTermOptions
    this.findManyOptions = Ops.FindTermsOptions
    this.findOne = Ops.FindTerm
    this.findMany = Ops.FindTerms

    // Find/Create
    this.findCreateOneOptions = Ops.FindCreateTermOptions
    this.findCreateManyOptions = Ops.FindCreateTermsOptions
    this.findCreateOne = Ops.FindCreateTerm
    this.findCreateMany = Ops.FindCreateTerms

    // Get
    this.getOneOptions = Ops.GetTermOptions
    this.getManyOptions = Ops.GetTermsOptions
    this.getOne = Ops.GetTerm
    this.getMany = Ops.GetTerms

    // Update
    this.updateOneOptions = Ops.UpdateTermOptions
    this.updateOne = Ops.UpdateTerm
  }

  /**
   * Build the options to find a list of terms.
   *
   * @param context The application context.
   *
   * @return The options to find a list of terms.
   */
  protected _buildFindManyOptions(context: Context): Ops.FindTermsOptions {

    // Add search parameters to query.
    const search = lodash.isString(context.query.search) ? context.query.search.replace(/[\%\_]/g, '') : ''
    const filters = !lodash.isEmpty(search) ? { name: ORM.Like('%' + search + '%') } : {}

    // Get the relations to populate.
    const relations = context.query.relations ? context.query.relations.split(/,/g) : []

    return ContentController.Transformer.plainToClass<Ops.FindTermsOptions, object>(
      this.findManyOptions,
      {
        skip: context.query.skip || 0,
        take: context.query.take || 10,
        where: filters,
        relations: relations,
      },
      this._buildDecodeTransformOptions(context)
    )
  }
}
