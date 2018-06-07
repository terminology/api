import { Inquiry } from '../entities/Inquiry'
import { ContentController } from './Content'
import * as Ops from '../operations/Inquiry'

export class InquiryController extends ContentController<
  Inquiry,

  // Create.
  Ops.CreateInquiryOptions,
  never,
  Ops.CreateInquiry,
  never,

  // Find
  Ops.FindInquiryOptions,
  Ops.FindInquiriesOptions,
  Ops.FindInquiry,
  Ops.FindInquiries,

  // Find/Create
  never,
  never,
  never,
  never,

  // Get
  Ops.GetInquiryOptions,
  Ops.GetInquiriesOptions,
  Ops.GetInquiry,
  Ops.GetInquiries,

  // Update
  never,
  never,
  never,
  never
> {
  constructor() {
    super()
    this.type = Inquiry

    // Create
    this.createOneOptions = Ops.CreateInquiryOptions
    // this.createManyOptions = Ops.CreateInquiriesOptions
    this.createOne = Ops.CreateInquiry
    // this.createMany = Ops.CreateInquiries

    // Find
    this.findOneOptions = Ops.FindInquiryOptions
    this.findManyOptions = Ops.FindInquiriesOptions
    this.findOne = Ops.FindInquiry
    this.findMany = Ops.FindInquiries

    // Find/Create
    // this.findCreateOneOptions = Ops.FindCreateInquiryOptions
    // this.findCreateManyOptions = Ops.FindCreateInquiriesOptions
    // this.findCreateOne = Ops.FindCreateInquiry
    // this.findCreateMany = Ops.FindCreateInquiries

    // Get
    this.getOneOptions = Ops.GetInquiryOptions
    this.getManyOptions = Ops.GetInquiriesOptions
    this.getOne = Ops.GetInquiry
    this.getMany = Ops.GetInquiries

    // Update
    // this.updateOneOptions = Ops.UpdateInquiryOptions
    // this.updateOne = Ops.UpdateInquiry
  }
}
