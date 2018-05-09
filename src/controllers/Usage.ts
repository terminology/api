import { Usage } from '../entities/Usage'
import { ContentController } from './Content'
import * as Ops from '../operations/Usage'

export class UsageController extends ContentController<
  Usage,

  // Create.
  Ops.CreateUsageOptions,
  Ops.CreateUsagesOptions,
  Ops.CreateUsage,
  Ops.CreateUsages,

  // Find
  Ops.FindUsageOptions,
  Ops.FindUsagesOptions,
  Ops.FindUsage,
  Ops.FindUsages,

  // Find/Create
  never, // Ops.FindCreateUsageOptions,
  never, // Ops.FindCreateUsagesOptions,
  never, // Ops.FindCreateUsage,
  never, // Ops.FindCreateUsages,

  // Get
  Ops.GetUsageOptions,
  Ops.GetUsagesOptions,
  Ops.GetUsage,
  Ops.GetUsages,

  // Update
  Ops.UpdateUsageOptions,
  never,
  Ops.UpdateUsage,
  never
> {
  constructor() {
    super()
    this.type = Usage

    // Create
    this.createOneOptions = Ops.CreateUsageOptions
    this.createManyOptions = Ops.CreateUsagesOptions
    this.createOne = Ops.CreateUsage
    this.createMany = Ops.CreateUsages

    // Find
    this.findOneOptions = Ops.FindUsageOptions
    this.findManyOptions = Ops.FindUsagesOptions
    this.findOne = Ops.FindUsage
    this.findMany = Ops.FindUsages

    // Find/Create
    // this.findCreateOneOptions = Ops.FindCreateUsageOptions
    // this.findCreateManyOptions = Ops.FindCreateUsagesOptions
    // this.findCreateOne = Ops.FindCreateUsage
    // this.findCreateMany = Ops.FindCreateUsages

    // Get
    this.getOneOptions = Ops.GetUsageOptions
    this.getManyOptions = Ops.GetUsagesOptions
    this.getOne = Ops.GetUsage
    this.getMany = Ops.GetUsages

    // Update
    this.updateOneOptions = Ops.UpdateUsageOptions
    this.updateOne = Ops.UpdateUsage
  }
}
