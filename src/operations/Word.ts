import * as Validator from 'class-validator'
import * as lodash from 'lodash'
import * as ORM from 'typeorm'
import * as COps from './Content'
import * as Lang from '../helpers/Lang'
import { Context } from 'koa'
import { Content, ContentState } from '../entities/Content'
import { Word } from '../entities/Word'

export class CreateWordOptions extends COps.CreateContentOptions<Word> {

  @Validator.MinLength(1, {
    message: 'Name must be at least 1 characters.'
  })
  @Validator.MaxLength(255, {
    message: 'Name cannot be more than 255 characters.'
  })
  name: string
}
export class CreateWordsOptions extends COps.CreateContentsOptions<Word> {
  names: string[]
}
export class FindWordOptions extends COps.FindContentOptions<Word> {}
export class FindWordsOptions extends COps.FindContentsOptions<Word> {}
export class FindCreateWordOptions extends COps.FindCreateContentOptions<Word, FindWordOptions, CreateWordOptions> {}
export class FindCreateWordsOptions extends COps.FindCreateContentsOptions<Word, FindWordsOptions, CreateWordsOptions> {}
export class GetWordOptions extends COps.GetContentOptions<Word> {}
export class GetWordsOptions extends COps.GetContentsOptions<Word> {}
export class UpdateWordOptions extends COps.UpdateContentOptions<Word> {
  name?: string
  acronym?: boolean
}
export class UpdateWordsOptions extends COps.UpdateContentsOptions<Word> {
}

/**
 * Create a word.
 */
export class CreateWord extends COps.CreateContent<Word, CreateWordOptions> {

  /**
   * Create a word.
   *
   * @param manager The entity manager.
   * @param context The application context.
   *
   * @return The created word.
   */
  protected async _execute(manager: ORM.EntityManager, context: Context): Promise<Word> {

    // Get the name.
    const name = this.options.name

    // Create the word.
    const word = manager.create(Word, {
      name: name,
      slug: Lang.slugify(name),
      stem: Lang.stem(name),
      length: Lang.length(name),
      numeric: Lang.isNumeric(name),
      state: this.options.state || ContentState.Draft,
      createdAt: new Date(),
      createdBy: context.user,
    })

    // Save the word.
    return manager.save(Word, word)
  }
}

/**
 * Create a list of words.
 */
export class CreateWords extends COps.CreateContents<Word, CreateWordsOptions> {

  /**
   * Create a list of words.
   *
   * @param manager The entity manager.
   * @param context The application context.
   *
   * @return The created words.
   */
  protected async _execute(manager: ORM.EntityManager, context: Context): Promise<Word[]> {

    // Create the words.
    const words = this.options.names.map(name => {
      return manager.create(Word, {
        name: name,
        slug: Lang.slugify(name),
        stem: Lang.stem(name),
        length: Lang.length(name),
        numeric: Lang.isNumeric(name),
        state: this.options.state || ContentState.Draft,
        createdAt: new Date(),
        createdBy: context.user,
      })
    })

    // Save the words.
    return manager.save(Word, words)
  }
}

/**
 * Find a word.
 */
export class FindWord extends COps.FindContent<Word, FindWordOptions> {
  constructor(options: FindWordOptions) {
    super(options, Word)
  }
}

/**
 * Find a list of words.
 */
export class FindWords extends COps.FindContents<Word, FindWordsOptions> {
  constructor(options: FindWordsOptions) {
    super(options, Word)
  }
}

/**
 * Find or create a word.
 */
export class FindCreateWord extends COps.FindCreateContent<Word, FindWordOptions, CreateWordOptions, FindCreateWordOptions> {

  /**
   * Find or create a word.
   *
   * @param manager The entity manager.
   * @param context The application context.
   *
   * @return The found/created word.
   */
  protected async _execute(manager: ORM.EntityManager, context: Context): Promise<Word> {

    const slug = Lang.slugify(this.options.create.name)

    // Try to find an existing word.
    let existing = await new FindWord(
      Object.assign({}, this.options.find, { where: { slug: slug } })
    ).execute(manager, context)

    // Check if the word exists.
    if (existing) {
      return existing
    }

    // Create the word.
    return new CreateWord(this.options.create).execute(manager, context)
  }
}

/**
 * Find or create a list of words.
 */
export class FindCreateWords extends COps.FindCreateContents<Word, FindWordsOptions, CreateWordsOptions, FindCreateWordsOptions> {

  /**
   * Find or create a list of words.
   *
   * @param manager The entity manager.
   * @param context The application context.
   *
   * @return The found/created list of words.
   */
  protected async _execute(manager: ORM.EntityManager, context: Context): Promise<Word[]> {

    // Index the word name to the slug.
    const slugMap = lodash.keyBy(this.options.create.names, (name) => Lang.slugify(name))

    // Find the existing words.
    const existing = await new FindWords({ where: { slug: ORM.In(lodash.keys(slugMap)) } }).execute(manager, context)

    // Index existing words by slug.
    const existingMap = lodash.keyBy(existing, 'slug')

    // Find the missing words by slug.
    const missingSlugs = lodash.difference(lodash.keys(slugMap), lodash.keys(existingMap))
    const missingWords = lodash.values(lodash.pick(slugMap, missingSlugs))

    // Create the missing words.
    const created = await new CreateWords({ names: missingWords }).execute(manager, context)

    // Merge created and existing.
    return created.concat(existing)
  }
}

/**
 * Get a word.
 */
export class GetWord extends COps.GetContent<Word, COps.GetContentOptions<Word>> {
  constructor(options: COps.GetContentOptions<Word>) {
    super(options, Word)
  }
}

/**
 * Get a list of words.
 */
export class GetWords extends COps.GetContents<Word, COps.GetContentsOptions<Word>> {
  constructor(options: COps.GetContentsOptions<Word>) {
    super(options, Word)
  }
}

/**
 * Update a word.
 */
export class UpdateWord extends COps.UpdateContent<Word, UpdateWordOptions> {

  /**
   * Update a word.
   *
   * @param manager The entity manager.
   * @param context The application context.
   *
   * @return The updated word.
   */
  protected async _execute(manager: ORM.EntityManager, context: Context): Promise<Word | undefined> {

    // Get the word.
    let word = await new GetWord(this.options).execute(manager, context)

    // Check if the word was found.
    if (!word) {
      return undefined
    }

    // Get the updated/original name.
    const name = this.options.name || word.name

    // Merge in the updated properties.
    word = manager.merge(
      Word,
      word,
      {
        name: name,
        slug: Lang.slugify(name),
        stem: Lang.stem(name),
        length: Lang.length(name),
        numeric: Lang.isNumeric(name),
        acronym: !lodash.isUndefined(this.options.acronym) ? this.options.acronym : word.acronym,
        state: this.options.state || word.state,
        lastUpdatedAt: new Date(),
        lastUpdatedBy: context.user,
      }
    )

    // Save the word.
    return manager.save(Word, word)
  }
}
