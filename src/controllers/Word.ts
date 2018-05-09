import { Word } from '../entities/Word'
import { ContentController } from './Content'
import * as Ops from '../operations/Word'

export class WordController extends ContentController<
  Word,

  // Create.
  Ops.CreateWordOptions,
  Ops.CreateWordsOptions,
  Ops.CreateWord,
  Ops.CreateWords,

  // Find
  Ops.FindWordOptions,
  Ops.FindWordsOptions,
  Ops.FindWord,
  Ops.FindWords,

  // Find/Create
  Ops.FindCreateWordOptions,
  Ops.FindCreateWordsOptions,
  Ops.FindCreateWord,
  Ops.FindCreateWords,

  // Get
  Ops.GetWordOptions,
  Ops.GetWordsOptions,
  Ops.GetWord,
  Ops.GetWords,

  // Update
  Ops.UpdateWordOptions,
  never,
  Ops.UpdateWord,
  never
> {
  constructor() {
    super()
    this.type = Word

    // Create
    this.createOneOptions = Ops.CreateWordOptions
    this.createManyOptions = Ops.CreateWordsOptions
    this.createOne = Ops.CreateWord
    this.createMany = Ops.CreateWords

    // Find
    this.findOneOptions = Ops.FindWordOptions
    this.findManyOptions = Ops.FindWordsOptions
    this.findOne = Ops.FindWord
    this.findMany = Ops.FindWords

    // Find/Create
    this.findCreateOneOptions = Ops.FindCreateWordOptions
    this.findCreateManyOptions = Ops.FindCreateWordsOptions
    this.findCreateOne = Ops.FindCreateWord
    this.findCreateMany = Ops.FindCreateWords

    // Get
    this.getOneOptions = Ops.GetWordOptions
    this.getManyOptions = Ops.GetWordsOptions
    this.getOne = Ops.GetWord
    this.getMany = Ops.GetWords

    // Update
    this.updateOneOptions = Ops.UpdateWordOptions
    this.updateOne = Ops.UpdateWord
  }
}
