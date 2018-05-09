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
}
