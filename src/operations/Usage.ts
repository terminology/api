import * as Validator from 'class-validator'
import * as lodash from 'lodash'
import * as ORM from 'typeorm'
import * as COps from './Content'
import * as Lang from '../helpers/Lang'
import { Context } from 'koa'
import { Content, ContentState } from '../entities/Content'
import { Usage } from '../entities/Usage'

export class CreateUsageOptions extends COps.CreateContentOptions<Usage> {

  @Validator.MinLength(1, {
    message: 'Name must be at least 1 characters.'
  })
  @Validator.MaxLength(255, {
    message: 'Name cannot be more than 255 characters.'
  })
  name: string
}
export class CreateUsagesOptions extends COps.CreateContentsOptions<Usage> {
  names: string[]
}
export class FindUsageOptions extends COps.FindContentOptions<Usage> {}
export class FindUsagesOptions extends COps.FindContentsOptions<Usage> {}
// export class FindCreateUsageOptions extends COps.FindCreateContentOptions<Usage, FindUsageOptions, CreateUsageOptions> {}
// export class FindCreateUsagesOptions extends COps.FindCreateContentsOptions<Usage, FindUsagesOptions, CreateUsagesOptions> {}
export class GetUsageOptions extends COps.GetContentOptions<Usage> {}
export class GetUsagesOptions extends COps.GetContentsOptions<Usage> {}
export class UpdateUsageOptions extends COps.UpdateContentOptions<Usage> {
  name?: string
  slug?: string
}
export class UpdateUsagesOptions extends COps.UpdateContentsOptions<Usage> {}

/**
 * Create a usage.
 */
export class CreateUsage extends COps.CreateContent<Usage, CreateUsageOptions> {

  /**
   * Create a usage.
   *
   * @param manager The entity manager.
   * @param context The application context.
   *
   * @return The created usage.
   */
  protected async _execute(manager: ORM.EntityManager, context: Context): Promise<Usage> {

    // Create the usage.
    const usage = manager.create(Usage, {
      name: this.options.name,
      slug: Lang.slugify(this.options.name),
      state: this.options.state || ContentState.Draft,
      createdAt: new Date(),
      createdBy: context.user,
    })

    // Save the usage.
    return manager.save(Usage, usage)
  }
}

/**
 * Create a list of usages.
 */
export class CreateUsages extends COps.CreateContents<Usage, CreateUsagesOptions> {

  /**
   * Create a list of usages.
   *
   * @param manager The entity manager.
   * @param context The application context.
   *
   * @return The created usages.
   */
  protected async _execute(manager: ORM.EntityManager, context: Context): Promise<Usage[]> {

    // Create the usages.
    const usages = this.options.names.map(name => {
      return manager.create(Usage, {
        name: name,
        slug: Lang.slugify(name),
        state: this.options.state || ContentState.Draft,
        createdAt: new Date(),
        createdBy: context.user,
      })
    })

    // Save the usages.
    return manager.save(Usage, usages)
  }
}

/**
 * Find a usage.
 */
export class FindUsage extends COps.FindContent<Usage, FindUsageOptions> {
  constructor(options: FindUsageOptions) {
    super(options, Usage)
  }
}

/**
 * Find a list of usages.
 */
export class FindUsages extends COps.FindContents<Usage, FindUsagesOptions> {
  constructor(options: FindUsagesOptions) {
    super(options, Usage)
  }
}

// /**
//  * Find or create a usage.
//  */
// export class FindCreateUsage extends COps.FindCreateContent<Usage, FindUsageOptions, CreateUsageOptions, FindCreateUsageOptions> {
//
//   /**
//    * Find or create a usage.
//    *
//    * @param manager The entity manager.
//    * @param context The application context.
//    *
//    * @return The found/created usage.
//    */
//   protected async _execute(manager: ORM.EntityManager, context: Context): Promise<Usage> {
//
//     const slug = Lang.slugify(this.options.create.name)
//
//     // Try to find an existing usage.
//     let existing = await new FindUsage(
//       Object.assign({}, this.options.find, { where: { slug: slug } })
//     ).execute(manager, context)
//
//     // Check if the usage exists.
//     if (existing) {
//       return existing
//     }
//
//     // Create the usage.
//     return new CreateUsage(this.options.create).execute(manager, context)
//   }
// }
//
// /**
//  * Find or create a list of usages.
//  */
// export class FindCreateUsages extends COps.FindCreateContents<Usage, FindUsagesOptions, CreateUsagesOptions, FindCreateUsagesOptions> {
//
//   /**
//    * Find or create a list of usages.
//    *
//    * @param manager The entity manager.
//    * @param context The application context.
//    *
//    * @return The found/created list of usages.
//    */
//   protected async _execute(manager: ORM.EntityManager, context: Context): Promise<Usage[]> {
//
//     // Index the usage name to the slug.
//     const slugMap = lodash.keyBy(this.options.create.names, (name) => Lang.slugify(name))
//
//     // Find the existing usages.
//     const existing = await new FindUsages({ where: { slug: ORM.In(lodash.keys(slugMap)) } }).execute(manager, context)
//
//     // Index existing usages by slug.
//     const existingMap = lodash.keyBy(existing, 'slug')
//
//     // Find the missing usages by slug.
//     const missingSlugs = lodash.difference(lodash.keys(slugMap), lodash.keys(existingMap))
//     const missingUsages = lodash.values(lodash.pick(slugMap, missingSlugs))
//
//     // Create the missing usages.
//     const created = await new CreateUsages({ names: missingUsages }).execute(manager, context)
//
//     // Merge created and existing.
//     return created.concat(existing)
//   }
// }

/**
 * Get a usage.
 */
export class GetUsage extends COps.GetContent<Usage, COps.GetContentOptions<Usage>> {
  constructor(options: COps.GetContentOptions<Usage>) {
    super(options, Usage)
  }
}

/**
 * Get a list of usages.
 */
export class GetUsages extends COps.GetContents<Usage, COps.GetContentsOptions<Usage>> {
  constructor(options: COps.GetContentsOptions<Usage>) {
    super(options, Usage)
  }
}

/**
 * Update a usage.
 */
export class UpdateUsage extends COps.UpdateContent<Usage, UpdateUsageOptions> {

  /**
   * Update a usage.
   *
   * @param manager The entity manager.
   * @param context The application context.
   *
   * @return The updated usage.
   */
  protected async _execute(manager: ORM.EntityManager, context: Context): Promise<Usage | undefined> {

    // Get the usage.
    let usage = await new GetUsage(this.options).execute(manager, context)

    // Check if the usage was found.
    if (!usage) {
      return undefined
    }

    // Merge in the updated properties.
    usage = manager.merge(
      Usage,
      usage,
      {
        state: this.options.state || usage.state,
        lastUpdatedAt: new Date(),
        lastUpdatedBy: context.user,
      }
    )

    // Save the usage.
    return manager.save(Usage, usage)
  }
}
