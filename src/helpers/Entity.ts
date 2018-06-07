import * as lodash from 'lodash'
import { Context } from 'koa'
import * as ORM from 'typeorm'

export type Paths = { [key: string]: Paths }

/**
 * Expand relations array to nested paths.
 *
 * @param relations The array of relations to populate.
 *
 * @return The nested paths.
 */
export function expandPaths(relations: string[]): Paths {

  // Initialize all paths as empty objects.
  let paths = lodash.reduce(
    relations,
    (paths: Paths, relation: string) => {
      lodash.set(paths, relation, {})
      return paths
    },
    {}
  )

  return paths
}

/**
 * Collapse nested paths to relations array.
 *
 * @param paths  The nested paths.
 * @param prefix The path prefix.
 *
 * @return The relations array.
 */
export function collapsePaths(paths: Paths, prefix: string = ''): string[] {
  return lodash.reduce(
    paths,
    (list: string[], value: Paths, key: string) => {

      // Initialize the prefix.
      if (!lodash.isEmpty(prefix)) {
        prefix = lodash.trimEnd(prefix, '.') + '.'
      }

      // Add the path to the list.
      list.push(prefix + key)

      // If there are nested paths, add them recursively.
      if (lodash.isObject(paths[key]) && !lodash.isEmpty(paths[key])) {
        return list.concat(collapsePaths(paths[key], prefix + key))
      }

      return list
    },
    []
  )
}

/**
 * Entity relationship populater.
 *
 * @param manager   The entity manager.
 * @param context   The application context.
 * @param entity    The entity.
 * @param relations The sub-relations to populate.
 *
 * @return The entity item.
 */
export type Populater<T, R> = (manager: ORM.EntityManager, context: Context, entity: T, relations?: string[]) => Promise<R>

/**
 * Entity relation populaters
 */
export type Populaters<C> = {
  [key: string]: Populater<C, any>
}
