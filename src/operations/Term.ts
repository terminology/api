import * as Validator from 'class-validator'
import * as lodash from 'lodash'
import * as ORM from 'typeorm'
import * as COps from './Content'
import * as Lang from '../helpers/Lang'
import { Context } from 'koa'
import { Content, ContentState } from '../entities/Content'
import { Term } from '../entities/Term'
import { Connection } from '../entities/Connection'
import * as WOps from './Word'
import * as CxOps from './Connection'

export class CreateTermOptions extends COps.CreateContentOptions<Term> {

  @Validator.MinLength(1, {
    message: 'Name must be at least 1 characters.'
  })
  @Validator.MaxLength(255, {
    message: 'Name cannot be more than 255 characters.'
  })
  name: string
}
export class CreateTermsOptions extends COps.CreateContentsOptions<Term> {
  names: string[]
}
export class FindTermOptions extends COps.FindContentOptions<Term> {}
export class FindTermsOptions extends COps.FindContentsOptions<Term> {}
export class FindCreateTermOptions extends COps.FindCreateContentOptions<Term, FindTermOptions, CreateTermOptions> {}
export class FindCreateTermsOptions extends COps.FindCreateContentsOptions<Term, FindTermsOptions, CreateTermsOptions> {}
export class GetTermOptions extends COps.GetContentOptions<Term> {}
export class GetTermsOptions extends COps.GetContentsOptions<Term> {}
export class UpdateTermOptions extends COps.UpdateContentOptions<Term> {}
export class UpdateTermsOptions extends COps.UpdateContentsOptions<Term> {}

/**
 * Populate the connections for a term.
 *
 * @param manager The entity manager.
 * @param context The application context.
 * @param content The term.
 *
 * @return The term.
 */
export async function populateConnections(manager: ORM.EntityManager, context: Context, term: Term, relations?: string[]): Promise<Connection[]> {

  // Get the connections.
  return new CxOps.FindConnections({ where: { term: term.id }, relations: relations }).execute(manager, context)
}

/**
 * Create a term.
 */
export class CreateTerm extends COps.CreateContent<Term, CreateTermOptions> {

  /**
   * Create a term.
   *
   * @param manager The entity manager.
   * @param context The application context.
   *
   * @return The created term.
   */
  protected async _execute(manager: ORM.EntityManager, context: Context): Promise<Term> {

    // Find/create the words for the term.
    let words = new WOps.FindCreateWords({
      create: {
        names: lodash.uniq(Lang.tokenize(this.options.name))
      }
    })
    .execute(manager, context)

    // Create the term.
    const term = manager.create(Term, {
      name: this.options.name,
      slug: Lang.slugify(this.options.name),
      state: this.options.state || ContentState.Draft,
      words: await words,
      createdAt: new Date(),
      createdBy: context.user,
    })

    // Save the term.
    return manager.save(Term, term)
  }
}

/**
 * Create a list of terms.
 */
export class CreateTerms extends COps.CreateContents<Term, CreateTermsOptions> {

  /**
   * Create a list of terms.
   *
   * @param manager The entity manager.
   * @param context The application context.
   *
   * @return The created terms.
   */
  protected async _execute(manager: ORM.EntityManager, context: Context): Promise<Term[]> {

    // Get the words for each term.
    const wordNameByTerm = lodash.reduce(
      this.options.names,
      (map: {}, name: string) => {
        map[name] = lodash.uniq(Lang.tokenize(name))
        return map
      },
      {}
    )

    // Find/create all words for all terms.
    let words = await new WOps.FindCreateWords({ create: { names: lodash.values(wordNameByTerm) } }).execute(manager, context)
    let wordsByName = lodash.keyBy(words, 'name')

    // Map the original term name to the word objects.
    const wordsByTerm = lodash.reduce(
      wordNameByTerm,
      (map: {}, words: string[], name: string) => {
        map[name] = words.map(word => wordsByName[word])
        return map
      },
      {}
    )

    // Create the terms.
    const terms = this.options.names.map(name => {
      return manager.create(Term, {
        name: name,
        slug: Lang.slugify(name),
        state: this.options.state || ContentState.Draft,
        words: wordsByTerm[name],
        createdAt: new Date(),
        createdBy: context.user,
      })
    })

    // Save the terms.
    return manager.save(Term, terms)
  }
}

/**
 * Find a term.
 */
export class FindTerm extends COps.FindContent<Term, FindTermOptions> {
  constructor(options: FindTermOptions) {
    super(options, Term)
  }
}

/**
 * Find a list of terms.
 */
export class FindTerms extends COps.FindContents<Term, FindTermsOptions> {
  constructor(options: FindTermsOptions) {
    super(options, Term)
  }
}

/**
 * Find or create a term.
 */
export class FindCreateTerm extends COps.FindCreateContent<Term, FindTermOptions, CreateTermOptions, FindCreateTermOptions> {

  /**
   * Find or create a term.
   *
   * @param manager The entity manager.
   * @param context The application context.
   *
   * @return The found/created term.
   */
  protected async _execute(manager: ORM.EntityManager, context: Context): Promise<Term> {

    const slug = Lang.slugify(this.options.create.name)

    // Try to find an existing term.
    let existing = await new FindTerm(
      Object.assign({}, this.options.find, { where: { slug: slug }, relations: this.options.find ? this.options.find.relations || [] : [] })
    ).execute(manager, context)

    // Check if the term exists.
    if (existing) {
      return existing
    }

    // Create the term.
    return new CreateTerm(this.options.create).execute(manager, context)
  }
}

/**
 * Find or create a list of terms.
 */
export class FindCreateTerms extends COps.FindCreateContents<Term, FindTermsOptions, CreateTermsOptions, FindCreateTermsOptions> {

  /**
   * Find or create a list of terms.
   *
   * @param manager The entity manager.
   * @param context The application context.
   *
   * @return The found/created list of terms.
   */
  protected async _execute(manager: ORM.EntityManager, context: Context): Promise<Term[]> {

    // Index the term name to the slug.
    const slugMap = lodash.keyBy(this.options.create.names, (name) => Lang.slugify(name))

    // Find the existing terms.
    const existing = await new FindTerms({ where: { slug: ORM.In(lodash.keys(slugMap)) } }).execute(manager, context)

    // Index existing terms by slug.
    const existingMap = lodash.keyBy(existing, 'slug')

    // Find the missing terms by slug.
    const missingSlugs = lodash.difference(lodash.keys(slugMap), lodash.keys(existingMap))
    const missingTerms = lodash.values(lodash.pick(slugMap, missingSlugs))

    // Create the missing terms.
    const created = await new CreateTerms({ names: missingTerms }).execute(manager, context)

    // Merge created and existing.
    return created.concat(existing)
  }
}

/**
 * Get a term.
 */
export class GetTerm extends COps.GetContent<Term, COps.GetContentOptions<Term>> {
  constructor(options: COps.GetContentOptions<Term>) {
    super(options, Term)
    this.populaters.connections = populateConnections
  }
}

/**
 * Get a list of terms.
 */
export class GetTerms extends COps.GetContents<Term, COps.GetContentsOptions<Term>> {
  constructor(options: COps.GetContentsOptions<Term>) {
    super(options, Term)
  }
}

/**
 * Update a term.
 */
export class UpdateTerm extends COps.UpdateContent<Term, UpdateTermOptions> {

  /**
   * Update a term.
   *
   * @param manager The entity manager.
   * @param context The application context.
   *
   * @return The updated term.
   */
  protected async _execute(manager: ORM.EntityManager, context: Context): Promise<Term | undefined> {

    // Get the term.
    let term = await new GetTerm(this.options).execute(manager, context)

    // Check if the term was found.
    if (!term) {
      return undefined
    }

    // Merge in the updated properties.
    term = manager.merge(
      Term,
      term,
      {
        state: this.options.state || term.state,
        lastUpdatedAt: new Date(),
        lastUpdatedBy: context.user,
      }
    )

    // Save the term.
    return manager.save(Term, term)
  }
}
